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
    return this.recordedTime.map((rapTime) => {
      let timeSections = rapTime.split(/:|./g);
      let totalTimeSeconds =
        (timeSections[0] * 60 + timeSections[1]) * 100 + timeSections[2];
      let totalTimeString =
        totalTimeSeconds / 60 +
        ':' +
        (totalTimeSeconds % 60) / 100 +
        '.' +
        (totalTimeSeconds % 100);
      return totalTimeString;
    });
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
