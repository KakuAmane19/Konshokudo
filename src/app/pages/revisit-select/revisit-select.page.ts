import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-revisit-select',
  templateUrl: './revisit-select.page.html',
  styleUrls: ['./revisit-select.page.scss'],
})
export class RevisitSelectPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  gotoRevisitGame() {
    this.router.navigateByUrl('/revisit-game');
  }

  //復習ゲームの数をバッヂに描画
  //復習ゲームのデータ構造とカッズはサービスから受け取る

  //復習ゲーム一覧を描画
}
