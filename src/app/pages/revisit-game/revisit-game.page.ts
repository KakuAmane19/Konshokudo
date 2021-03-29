import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

const time$ = timer(3000);

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
  selector: 'app-revisit-game',
  templateUrl: './revisit-game.page.html',
  styleUrls: ['./revisit-game.page.scss'],
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
export class RevisitGamePage implements OnInit {
  //復習問題データ
  public gameData: Object;
  private correctByOnce = true;

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

  //選択肢行数コントロール
  public r = Math.round(10 / 2 + 0.4);

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
    private recordService: RecordService
  ) {}

  ngOnInit() {
    this.getOptions();
    this.genQuestion();
  }

  ionViewDidLeave() {
    this.correctOrIncorrect = '';
    this.correctByOnce = true;
  }

  /**
   * ゲーム終了
   * @returns
   */
  async gameClear(): Promise<void> {
    this.gameData['challengeTimes'] = (
      parseInt(this.gameData['challengeTimes']) + 1
    ).toString();
    this.gameData['revisit'] = this.correctByOnce;
    await this.recordService.removeRevisitGames(this.gameData);
    time$.subscribe(() => {
      this.router.navigateByUrl('/revisit-select');
    });
  }

  /**
   * 全色データ（サービス）から問題を受け取り表示
   * @param nothing
   */
  getOptions() {
    this.visibleOptions = this.allColorsService.provideOptions('REVISIT');
    return;
  }

  /**
   * 出題色の決定
   * @param nothing
   */
  genQuestion() {
    this.gameData = this.allColorsService.provideTheGameData();
    this.question = this.gameData['question'];
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

    //console.log(this.selectees, this.selectedOptions);
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
  async printJudge(): Promise<void> {
    if (this.selectedOptions[this.tempY][this.tempX]) {
      this.selectedOptions[this.tempY][this.tempX] = false;
      this.selectees[0][0] = -1;
      this.selectees[0][1] = -1;
      //console.log(this.selectees);
    } else if (-1 < this.selectees[0][0]) {
      this.selectedOptions[this.tempY][this.tempX] = true;
      this.selectees[1][0] = this.tempX;
      this.selectees[1][1] = this.tempY;

      //console.log(this.selectees);

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
        await this.gameClear();
      } else {
        this.sf_color = 'blue';
        this.correctOrIncorrect = '不正解……';
        this.answer = '';
        this.correctByOnce = false;
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
