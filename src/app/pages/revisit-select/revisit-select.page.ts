import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { RecordService } from '../../services/record.service';
import { AllColorsService } from '../../services/all-colors.service';

@Component({
  selector: 'app-revisit-select',
  templateUrl: './revisit-select.page.html',
  styleUrls: ['./revisit-select.page.scss'],
})
export class RevisitSelectPage implements OnInit {
  public revisitGames: Array<Object> = [
    { question: '', answer1: '', answer2: '', challengeTimes: '-1' },
  ];

  public badge: string = '';

  constructor(
    private router: Router,
    private recordService: RecordService,
    private allColorsService: AllColorsService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.printRevisitGames();
    this.printBadge();
  }

  gotoRevisitGame(revisitGame: Object) {
    this.allColorsService.reserveTheGameData(revisitGame);
    console.log(revisitGame);
    this.router.navigateByUrl('/revisit-game');
  }

  //復習ゲームの数をバッヂに描画
  printBadge() {
    this.badge = this.revisitGames.length.toString();
  }

  /**復習ゲーム一覧を描画
   *
   */
  async printRevisitGames(): Promise<void> {
    this.revisitGames = await this.recordService.provideRevisitGames();
  }
}
