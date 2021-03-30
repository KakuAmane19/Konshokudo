import { Component, OnInit } from '@angular/core';

import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  public review: Array<Object> = [...Array(10)].fill({
    qno: '-1',
    question: 'rgb(100,200,50)',
    answer1: 'hsl(60,50%,50%)',
    answer2: 'hsl(270,90%,90%)',
    rapTime: '00:10:20',
    revisit: false,
  });

  constructor(private recordService: RecordService) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.review = this.recordService.provideReview();
  }
}
