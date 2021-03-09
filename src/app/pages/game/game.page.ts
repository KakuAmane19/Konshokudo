import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer, Observable } from 'rxjs';

import { AllColorsService } from '../../services/all-colors.service';
import { JudgeService } from '../../services/judge.service';
const time$ = timer(3000);

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  //色オブジェクト

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

  //今何問目？

  //正解不正解
  public correctOrIncorrect = '';

  //その他デバッグ用変数
  public selectedColor = false;
  private allColors;

  constructor(
    private router: Router,
    private allColorsService: AllColorsService,
    private judgeService: JudgeService
  ) {}

  ngOnInit() {
    this.getOptions();
    this.genQuestion();
  }

  ngDoCheck() {
    //time$.subscribe(() => this.router.navigateByUrl('/result'));
  }

  /**
   * タイマーの表示
   * @param
   */

  /**
   * ラップタイムの記録＝＞サービス
   * @param
   */

  /**
   *今何問目？の更新とゲーム終了
   * @param
   */

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
    //25色からランダムに2色取り出し
    let pickedSource = [...Array(4)]
      .fill(4.9)
      .map((v) => Math.floor(Math.random() * v));

    //hsl値の切り出し
    let source1 = this.visibleOptions[pickedSource[0] * 5 + pickedSource[1]];
    let source2 = this.visibleOptions[pickedSource[2] * 5 + pickedSource[3]];

    //各値平均
    let hsl1 = source1.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);
    let hsl2 = source2.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);

    let questionHSL = hsl1.map((v, i) => (parseInt(v) + parseInt(hsl2[i])) / 2);

    //セット
    this.question =
      'hsl(' +
      questionHSL[0] +
      ',' +
      questionHSL[1] +
      '%,' +
      questionHSL[2] +
      '%)';
    console.log(
      pickedSource,
      source1,
      source2,
      hsl1,
      hsl2,
      questionHSL,
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
      console.log(this.selectees, this.answer);
    } else if (-1 < this.selectees[0][0]) {
      this.selectedOptions[this.tempY][this.tempX] = true;
      this.selectees[1][0] = this.tempX;
      this.selectees[1][1] = this.tempY;

      console.log(this.selectees, this.answer);

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

      let answerHSL = hsl1.map((v, i) => (parseInt(v) + parseInt(hsl2[i])) / 2);

      //セット
      this.answer =
        'hsl(' + answerHSL[0] + ',' + answerHSL[1] + '%,' + answerHSL[2] + '%)';

      //判定
      this.correctOrIncorrect = this.judgeService.judge(
        this.question,
        this.answer
      )
        ? '正解！'
        : '不正解……';

      //initialize
      for (let c = 0; c < this.selectedOptions.length; c++)
        this.selectedOptions[c].fill(false);
      for (let c = 0; c < this.selectees.length; c++)
        this.selectees[c].fill(-1);
      if (this.correctOrIncorrect === '正解！') {
        this.getOptions();
        this.genQuestion();
      }
      this.answer = 'hsl(' + 0 + ',' + 0 + '%,' + 100 + '%)';
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
