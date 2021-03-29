import { Component, OnInit } from '@angular/core';

import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  public review: Array<Object> = [...Array(10)].fill({
    qno: '',
    question: '',
    answer1: '',
    answer2: '',
    rapTime: '',
    review: '',
  });

  constructor(private recordService: RecordService) {}

  ngOnInit() {
    //今回のラップタイムと要復習、問題と回答を受け取る
    this.review = this.recordService.provideReview();
    //描画
  }
}
