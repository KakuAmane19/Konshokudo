import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer, Observable } from 'rxjs';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  sequence,
  state,
  keyframes,
} from '@angular/animations';

import { AllColorsService } from '../../services/all-colors.service';
import { JudgeService } from '../../services/judge.service';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  animations: [
    trigger('fadeout', [
      state('visible', style({})),
      state('invisible', style({})),
      transition('visible => invisible', [
        animate(
          '1s',
          keyframes([
            style({ opacity: 1, offset: 0.0 }),
            style({ opacity: 1, offset: 0.5 }),
            style({ opacity: 0, offset: 1.0 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class GamePage implements OnInit {
  //選択肢カラーオブジェクト5*5
  public selectedOptions = Array(5)
    .fill(0)
    .map(() => Array(5).fill(false));
  public visibleOptions = Array(5).fill('');

  //選択している色の選択肢中の座標
  public selectees = Array(2)
    .fill(0)
    .map(() => Array(2).fill(-1));
  public tempY = -1;
  public tempX = -1;

  //問題カラーオブジェクト
  public question = '';

  //回答カラーオブジェクト
  public answer = '';

  //タイマー
  public timer = '00:00.00';
  counter: number;
  timerRef;
  running: boolean = false;

  //今何問目？
  public qno = '1';
  public r = Math.round(parseInt(this.qno) / 2 + 0.4);

  //正解不正解
  public correctOrIncorrect = '';
  public sf_color = 'red';
  onAnimationEnd(e) {
    this.correctOrIncorrect = '';
  }

  constructor(
    private router: Router,
    private allColorsService: AllColorsService,
    private judgeService: JudgeService,
    private recordService: RecordService //private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.getOptions();
    this.genQuestion();
    this.startTimer();
  }

  ionViewDidLeave() {
    this.getOptions();
    this.genQuestion();
    this.qno = '1';
    this.r = Math.round(parseInt(this.qno) / 2 + 0.4);
    this.correctOrIncorrect = '';
    this.clearTimer();
    clearInterval(this.timerRef);
  }

  /**
   * タイマーの開始と描写
   * @param
   */
  startTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = (Date.now() - startTime) / 1000;
        let min = Math.floor(this.counter / 60);
        let sec = Math.floor(this.counter) % 60;
        let msec = Math.floor((this.counter * 100) % 100);

        this.timer =
          min.toString().padStart(2, '0') +
          ':' +
          sec.toString().padStart(2, '0') +
          '.' +
          msec.toString().padStart(2, '0');
      });
    } else {
      clearInterval(this.timerRef);
    }
  }

  /**
   * タイマーのクリア
   * @param
   */
  clearTimer() {
    this.running = false;
    this.counter = undefined;
    clearInterval(this.timerRef);
  }

  /**
   *今何問目？の更新とゲーム終了
   * @param
   */
  gotoNext() {
    this.recordService.recordRapTime(this.timer);
    this.qno = (parseInt(this.qno) + 1).toString();
    if (this.qno === '11') {
      this.qno = '1';
      this.r = Math.round(parseInt(this.qno) / 2 + 0.4);
      this.correctOrIncorrect = '';
      //this.clearTimer();
      this.router.navigateByUrl('/result');
    }
    this.r = Math.round(parseInt(this.qno) / 2 + 0.4);
  }

  /**
   * 全色データ（サービス）から問題を受け取り表示
   * @param nothing
   */
  getOptions() {
    this.visibleOptions = this.allColorsService.provideOptions();
    return;
  }

  /**
   * 出題色の決定
   * @param nothing
   */
  genQuestion() {
    //25色からランダムに2色取り出し odd:x even:y
    let pickedSource = [...Array(4)]
      .fill(4.9)
      .map((v) => Math.floor(Math.random() * v));
    if (pickedSource[0] >= this.r || pickedSource[2] >= this.r) {
      pickedSource[0] = Math.floor(Math.random() * (this.r - 0.1));
      pickedSource[2] = Math.floor(Math.random() * (this.r - 0.1));
    }
    while (
      pickedSource[1] === pickedSource[3] &&
      pickedSource[0] === pickedSource[2]
    ) {
      pickedSource[2] = Math.floor(Math.random() * (this.r - 0.1));
      pickedSource[3] = Math.floor(Math.random() * 4.9);
    }

    let source1 = this.visibleOptions[pickedSource[0] * 5 + pickedSource[1]];
    let source2 = this.visibleOptions[pickedSource[2] * 5 + pickedSource[3]];

    let hsl1 = source1.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);
    let hsl2 = source2.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);

    let rgb1 = this.judgeService.HSVtoRGB(hsl1[0], hsl1[1], hsl1[2]);
    let rgb2 = this.judgeService.HSVtoRGB(hsl2[0], hsl2[1], hsl2[2]);

    let questionRGB = rgb1.map((v, i) => Math.round((v + rgb2[i]) / 2));

    this.question =
      'rgb(' +
      questionRGB[0] +
      ',' +
      questionRGB[1] +
      ',' +
      questionRGB[2] +
      ')';
    console.log(
      pickedSource,
      source1,
      source2,
      hsl1,
      hsl2,
      rgb1,
      rgb2,
      questionRGB,
      this.question
    );
  }

  /**
   * 選択肢のうち、選ばれたオブジェクトのY座標を保管するメソッド
   * 中で正誤判定表示メソッドを参照している
   * @param i 選択肢Y座標
   * @return nothing
   */
  selectColorY(i: number) {
    this.tempY = i;

    this.printJudge();

    console.log(this.selectees, this.selectedOptions);
  }

  /**
   * 選択肢のうち、選ばれたオブジェクトのX座標を保管するメソッド
   * @param i 選択肢X座標
   * @return nothing
   */
  selectColorX(i: number) {
    this.tempX = i;
  }

  /*******************************
   * 選択された色を検知し、正誤判定サービスに渡す、及び正誤判定を表示するメソッド
   */
  printJudge(): void {
    if (this.selectedOptions[this.tempY][this.tempX]) {
      this.selectedOptions[this.tempY][this.tempX] = false;
      this.selectees[0][0] = -1;
      this.selectees[0][1] = -1;
      console.log(this.selectees);
    } else if (-1 < this.selectees[0][0]) {
      this.selectedOptions[this.tempY][this.tempX] = true;
      this.selectees[1][0] = this.tempX;
      this.selectees[1][1] = this.tempY;

      console.log(this.selectees);

      //答え合わせメソッド=>サービスに移乗,メソッドの返り値から、正誤判定表示
      //hsl値の切り出し
      let source1 = this.visibleOptions[
        this.selectees[0][1] * 5 + this.selectees[0][0]
      ];
      let source2 = this.visibleOptions[
        this.selectees[1][1] * 5 + this.selectees[1][0]
      ];

      //各値平均
      let hsl1 = source1.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);
      let hsl2 = source2.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);

      let rgb1 = this.judgeService.HSVtoRGB(hsl1[0], hsl1[1], hsl1[2]);
      let rgb2 = this.judgeService.HSVtoRGB(hsl2[0], hsl2[1], hsl2[2]);

      let answerRGB = rgb1.map((v, i) => Math.round((v + rgb2[i]) / 2));

      //セット
      this.answer =
        'rgb(' + answerRGB[0] + ',' + answerRGB[1] + ',' + answerRGB[2] + ')';

      //判定
      let judge = this.judgeService.judge(this.question, this.answer);

      for (let c = 0; c < this.selectedOptions.length; c++)
        this.selectedOptions[c].fill(false);
      for (let c = 0; c < this.selectees.length; c++)
        this.selectees[c].fill(-1);

      if (judge === true) {
        this.sf_color = 'red';
        this.correctOrIncorrect = '正解！';
        this.answer = '';
        this.gotoNext();
        this.getOptions();
        this.genQuestion();
      } else {
        this.sf_color = 'blue';
        this.correctOrIncorrect = '不正解……';
        this.recordService.recordIncorrectByOnce(parseInt(this.qno));
        this.answer = '';
      }
    } else {
      this.selectedOptions[this.tempY][this.tempX] = true;
      this.selectees[0][0] = this.tempX;
      this.selectees[0][1] = this.tempY;

      //hsl値の切り出し
      let source1 = this.visibleOptions[
        this.selectees[0][1] * 5 + this.selectees[0][0]
      ];

      //各値平均
      let hsl1 = source1.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);

      //セット
      this.answer = 'hsl(' + hsl1[0] + ',' + hsl1[1] + '%,' + hsl1[2] + '%)';
    }
  }
}
