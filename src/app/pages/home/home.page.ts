import { Component, OnInit } from '@angular/core';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private recordService: RecordService) {}

  ngOnInit() {
    this.recordService.reset();
  }

  //revisitゲームの数を取得しバッヂに描画
}
