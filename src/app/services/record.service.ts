import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private recordedTime = [...Array(10)].fill('');
  private recordedCorrectByOnce = [...Array(10)].fill(true);

  constructor() {}

  /**
   * ラップタイムの記録＝＞サービス
   * @param rapTime:string
   * @return nothing
   */
  recordRapTime(rapTime: string) {
    for (let i = 0; i < this.recordedTime.length; i++) {
      if (this.recordedTime[i] === '') {
        this.recordedTime[i] = rapTime;
        console.log(this.recordedTime, rapTime);
        return;
      }
    }
  }

  /**
   * ラップタイムの記録
   * @param n:number 問題番号
   * @return nothing
   */
  recordIncorrectByOnce(n: number) {
    this.recordedCorrectByOnce[n - 1] = false;
    console.log(this.recordedCorrectByOnce, n);
  }

  /**
   * 問題記録
   * @param n:number 問題番号
   * @return nothing
   */
  /**
   * 回答色記録
   * @param n:number 問題番号
   * @return nothing
   */
  /**
   * サーバーに保存
   * @param n:number 問題番号
   * @return nothing
   */
  /**
   * ランキング更新判定とサーバー保存
   * @param n:number 問題番号
   * @return nothing
   */
}
