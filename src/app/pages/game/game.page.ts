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

  selectColorY(i: number) {
    this.tempY = i;

    //if:既に選択？
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
      //答え合わせメソッドs
      for (let c = 0; c < this.options.length; c++) this.options[c].fill(false);
      for (let c = 0; c < this.selectees.length; c++)
        this.selectees[c].fill(-1);
    } else {
      this.options[this.tempY][this.tempX] = true;
      this.selectees[0][0] = this.tempX;
      this.selectees[0][1] = this.tempY;
    }

    console.log(this.selectees, this.options);
  }

  selectColorX(i: number) {
    this.tempX = i;
  }
}
