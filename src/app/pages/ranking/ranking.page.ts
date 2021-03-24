import { Component, OnInit } from '@angular/core';

import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  items: any[] = [];

  //ランキング
  public rankings;

  constructor(private recordService: RecordService) {}

  async ngOnInit() {
    this.rankings = await this.recordService.provideRanking();
  }
}
