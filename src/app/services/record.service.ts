import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  private recordedTime = [...Array(10)].fill('');
  private recordedCorrectByOnce = [...Array(10)].fill(true);
  private keys = {
    RANKING: 'RANKING',
  };

  constructor(private storage: Storage) {}

  /**
   * ラップタイムの記録
   * @param rapTime:string
   * @return nothing
   */
  recordRapTime(rapTime: string) {
    for (let i = 0; i < this.recordedTime.length; i++) {
      if (this.recordedTime[i] === '') {
        this.recordedTime[i] = rapTime;
        return;
      }
    }
  }
  /**
   * 合計タイムの提供
   * @param nothing
   * @return totalTimeString:String
   */
  provideTotalTime() {
    this.recordedTime = [...Array(10)].fill('00:10.39'); //　デバッグ用
    console.log(this.recordedTime);
    let totalTimeString = this.recordedTime.reduce((pre, rapTime) => {
      let timeSections = rapTime.toString().split(/\:|\./g);
      let preTimeTotal = pre.toString().split(/\:|\./g);
      let totalTimeSeconds =
        (parseInt(timeSections[0]) + parseInt(preTimeTotal[0])) * 6000 +
        (parseInt(timeSections[1]) + parseInt(preTimeTotal[1])) * 100 +
        parseInt(timeSections[2]) +
        parseInt(preTimeTotal[2]);

      console.log(pre, rapTime, totalTimeSeconds, timeSections, preTimeTotal);

      let min = Math.floor(totalTimeSeconds / 6000);
      let sec = Math.floor((totalTimeSeconds % 6000) / 100);
      let msec = Math.floor(totalTimeSeconds % 100);

      return (
        min.toString().padStart(2, '0') +
        ':' +
        sec.toString().padStart(2, '0') +
        '.' +
        msec.toString().padStart(2, '0')
      );
    }, '00:00.00');
    console.log(totalTimeString);
    return totalTimeString;
  }

  /**
   * 一回目正答の記録
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
  recordQuestion(color: string) {}

  /**
   * 回答色記録
   * @param n:number 問題番号
   * @return nothing
   */
  recordAnswer(color1: string, color2: string) {}

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
  saveRanking() {
    this.storage.set(this.keys.RANKING, { '@*+++': '02:10.38' });
  }

  /**
   * ランキングを読み込んでデータを渡す
   * @param n:number 問題番号
   * @return nothing
   */
  provideRanking() {
    return this.storage.get(this.keys.RANKING);
  }
}
