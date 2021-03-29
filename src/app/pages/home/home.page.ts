import { Component, OnInit } from '@angular/core';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public revisitGames: Array<Object> = [
    { question: '', answer1: '', answer2: '', challengeTimes: '-1' },
  ];

  public badge: string = '';

  constructor(private recordService: RecordService) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.recordService.reset();
    await this.printBadge();
  }

  //revisitゲームの数を取得しバッヂに描画

  async printBadge(): Promise<void> {
    this.revisitGames = await this.recordService.provideRevisitGames();
    this.badge = this.revisitGames.length.toString();
  }
}
