import { CssSelector } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

const time$ = timer(3000);

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  //選択肢カラーオブジェクト5*5
  public options = Array(5)
    .fill(0)
    .map(() => Array(5).fill(false));

  //選択している色の選択肢中の座標
  public selectees = Array(2)
    .fill(0)
    .map(() => Array(2).fill(-1));
  public tempY = -1;
  public tempX = -1;

  //問題カラーオブジェクト

  //回答カラーオブジェクト

  //タイマー

  //今何問目？

  //正解不正解

  //その他デバッグ用変数
  public selectedColor = false;

  constructor(private router: Router) {}

  ngOnInit() {}

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
   * 全色データ（サービス）から問題を受け取り、ランダムに必要数獲得・表示
   * @param i
   */

  /**
   * 出題色の生成
   * @param i
   */

  /**
   * 選択肢のうち、選ばれたオブジェクトのY座標を保管し、判定するメソッド
   * QUESTION:値の確保と判定をこのコンポーネントのメソッド上で分けたほうがいい気がする……
   * @param i 選択肢Y座標
   * @return nothing
   */
  selectColorY(i: number) {
    this.tempY = i;

    this.printJudge();

    console.log(this.selectees, this.options);
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
   * 選択された色を正誤判定サービスに渡す・及び正誤判定を表示するメソッド
   */
  printJudge(): void {
    if (this.options[this.tempY][this.tempX]) {
      this.options[this.tempY][this.tempX] = false;
      this.selectees[0][0] = -1;
      this.selectees[0][1] = -1;
    } else if (
      -1 < this.selectees[0][0] &&
      !this.options[this.tempY][this.tempX]
    ) {
      this.options[this.tempY][this.tempX] = true;
      this.selectees[1][0] = this.tempX;
      this.selectees[1][1] = this.tempY;

      //答え合わせメソッド=>サービスに移乗

      //答え合わせメソッドの返り値から、正誤判定表示

      for (let c = 0; c < this.options.length; c++) this.options[c].fill(false);
      for (let c = 0; c < this.selectees.length; c++)
        this.selectees[c].fill(-1);
    } else {
      this.options[this.tempY][this.tempX] = true;
      this.selectees[0][0] = this.tempX;
      this.selectees[0][1] = this.tempY;
    }
  }
}
