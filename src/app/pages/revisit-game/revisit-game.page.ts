import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

const time$ = timer(3000);

@Component({
  selector: 'app-revisit-game',
  templateUrl: './revisit-game.page.html',
  styleUrls: ['./revisit-game.page.scss'],
})
export class RevisitGamePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  ngDoCheck() {
    //time$.subscribe(() => this.router.navigateByUrl('/revisit-select'));
  }

  //復習ゲーム
  //しばらく回答を見せる時間を作る。
  //一問正解したらセレクトに戻る
  //復習問題から消す
}
