import { Component, OnInit } from '@angular/core';

import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  //今回のタイム
  public record;
  //ランキング
  public rankings;

  constructor(private recordService: RecordService) {}

  async ngOnInit() {
    //今回のリザルト表示
    this.record = this.recordService.provideTotalTime();
    //リザルト20位以内?アラートを表示（）
    //if(){
    //アラート表示
    this.getName();
    //アラートから名前を受け取り
    this.getName();
    //}

    //ランキング受け取り
    await this.recordService.saveRanking();
    await this.recordService.provideRanking();
    //描画
    this.printRanking();
  }

  printRanking() {}

  getName() {}
}
