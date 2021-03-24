import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { time } from 'node:console';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  //private recordedTime = [...Array(10)].fill('');
  private recordedTime = [...Array(10)].fill('01:40.00'); //　デバッグ用
  private recordedCorrectByOnce = [...Array(10)].fill(true);
  private keys = {
    RANKING: 'RANKING',
  };
  private rankings = [...Array(20)].fill({
    rank: '',
    name: '',
    time: '',
    timeInCSec: Infinity,
  });

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
  provideTotalTime(): string {
    //this.recordedTime = [...Array(10)].fill('00:10.39'); //　デバッグ用
    return this.recordedTime[this.recordedTime.length - 1];
  }

  /**
   * Service内変数のリセット
   * @param nothing
   * @return totalTimeString:String
   */
  reset() {
    this.recordedTime = [...Array(10)].fill('');
    this.recordedCorrectByOnce = [...Array(10)].fill(true);
    console.log(this.recordedTime);
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
   * サーバーに復習問題を保存
   * @param n:number 問題番号
   * @return nothing
   */

  /**
   * ランクイン判定
   * @param nothing
   * @return boolean
   */
  async rankin(): Promise<boolean> {
    this.rankings = await this.provideRanking();
    if (
      this.rankings[this.rankings.length - 1].timeInCSec >=
      this.convertTimeStr2Int(this.recordedTime[9])
    )
      return true;
    return false;
  }

  /**
   * ランキング更新とサーバー保存
   * @param n:number 問題番号
   * @return nothing
   */
  async saveRanking(text) {
    this.rankings = await this.provideRanking();

    this.rankings.push({
      rank: '',
      name: text.name,
      time: this.recordedTime[9],
      timeInCSec: this.convertTimeStr2Int(this.recordedTime[9]),
    });

    this.rankings.sort((a, b) => {
      let comparison = 0;

      if (a.timeInCSec > b.timeInCSec) {
        comparison = 1;
      } else if (b.timeInCSec >= a.timeInCSec) {
        comparison = -1;
      }
      return comparison;
    });

    this.rankings
      .filter((v) => v.timeInCSec < Infinity)
      .map((v, i) => (v.rank = i + 1));
    console.log(this.rankings);

    await this.storage.set(this.keys.RANKING, this.rankings.slice(0, 20));
  }

  /**
   * ランキングを読み込んでデータを渡す
   * @param n:number 問題番号
   * @return nothing
   */
  provideRanking() {
    return this.storage.get(this.keys.RANKING);
  }

  /**
   * time => 1/100秒に変換
   * @param time:string 問題番号
   * @return timeInCSec:int 時間を整数で表現したもの[1/100秒]
   */
  private convertTimeStr2Int(time: string) {
    //console.log(time);
    if (time === '') return Infinity;
    let timeSections1 = time.split(/\:|\./g);
    let timeArray = timeSections1.map((v) => parseInt(v, 10));
    let timeInCSec = timeArray[0] * 6000 + timeArray[1] * 100 + timeArray[2];
    return timeInCSec;
  }
}
