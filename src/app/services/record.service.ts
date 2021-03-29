import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { time } from 'node:console';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  //ラップタイム
  private recordedTime = [...Array(10)].fill('');

  //一回目正解
  private recordedCorrectByOnce = [...Array(10)].fill(true);

  //キーオブジェクト
  private keys = {
    RANKING: 'RANKING',
    REVISIT_GAMES: 'REVISIT_GAMES',
  };

  //ランキング
  private rankings = [...Array(20)].fill({
    rank: '',
    name: '',
    time: '',
    timeInCSec: Infinity,
  });

  //振り返り用各問
  private reviews: Array<Object> = new Array<Object>();

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
    console.log(JSON.stringify(this.recordedTime));
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
    this.reviews = new Array<Object>();
    console.log(JSON.stringify(this.reviews));
  }

  /**
   * 一回目正答の記録
   * @param n:number 問題番号
   * @return nothing
   */
  recordIncorrectByOnce(n: number): void {
    this.recordedCorrectByOnce[n - 1] = false;
    console.log(this.recordedCorrectByOnce, n);
  }

  /**
   * 問題と回答色記録
   * @param color: string 回答色
   * @param n:number 問題番号
   * @param color1: string 回答色1
   * @param color2: string 回答色2
   * @return nothing
   */
  recordQuestion(
    questionColor: string,
    n: number,
    answerColor1: string,
    answerColor2: string
  ) {
    let gameReviews = {
      qno: n,
      question: questionColor,
      answer1: answerColor1,
      answer2: answerColor2,
    };
    this.reviews.push(gameReviews);
  }

  /**
   * 振り返りページ用の色データの完成
   * @return nothing
   */
  makeReview(): void {
    let temp = [...this.reviews.slice(0, 10)];
    temp.map((value, index) => {
      value['rapTime'] = [...this.recordedTime].splice(index, 1)[0];
      value['revisit'] = [...this.recordedCorrectByOnce].splice(index, 1)[0];
    });
    this.reviews = [...temp];
    console.log(JSON.stringify(this.reviews));
  }
  /**
   * 振り返りページ用色データの配布
   * @return nothing
   */
  provideReview(): Array<Object> {
    return this.reviews;
  }

  /**
   * サーバーに復習問題を保存
   * @return nothing
   */
  async recordRevisitGame(): Promise<void> {
    //ストレージから今の復習問題を引っ張り出す
    let revisitGames = await this.provideRevisitGames();
    if (revisitGames === null) revisitGames = Array<Object>();

    //今回の追加問題を選別
    let additionalGames = [...this.reviews].filter(
      (v) => v.hasOwnProperty('revisit') && !v['revisit']
    );
    if (additionalGames.length === 0) {
      additionalGames = Array<Object>();
    } else {
      additionalGames.map((v) => {
        delete v['rapTime'];
        delete v['qno'];
        v['challengeTimes'] = '0';
      });
    }

    //合成
    let newRevGames = [...additionalGames, ...revisitGames];
    //console.log({ revisitGames }, { additionalGames });
    //再保存
    await this.storage.set(this.keys.REVISIT_GAMES, newRevGames);
  }

  /**
   * 復習問題を提供
   * @returns
   */

  provideRevisitGames(): Promise<Array<Object>> {
    return this.storage.get(this.keys.REVISIT_GAMES);
  }

  /**
   * 復習問題から削除
   * @returns
   */

  async removeRevisitGames(gameData: Object): Promise<void> {
    console.log({ gameData });
    let buff: Array<Object> = await this.provideRevisitGames();

    buff.map((v) => {
      if (
        v['question'] === gameData['question'] &&
        v['answer1'] === gameData['answer1'] &&
        v['answer2'] === gameData['answer2']
      )
        v['challengeTimes'] = (
          parseInt(gameData['challengeTimes']) + 1
        ).toString();
      return v;
    });

    let newRevGames = gameData['revisit']
      ? buff.filter(
          (v) =>
            v['question'] !== gameData['question'] &&
            v['answer1'] !== gameData['answer1'] &&
            v['answer2'] !== gameData['answer2']
        )
      : buff;

    console.log({ buff, newRevGames });
    await this.storage.set(this.keys.REVISIT_GAMES, newRevGames);
  }

  /**
   * ランクイン判定
   * @param nothing
   * @return boolean
   */
  async rankin(): Promise<boolean> {
    this.rankings = await this.provideRanking();
    if (this.rankings === null) return true;
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
    console.log(JSON.stringify(this.rankings));
    if (this.rankings === null)
      this.rankings = [...Array(20)].fill({
        rank: '',
        name: '',
        time: '',
        timeInCSec: Infinity,
      });

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
    console.log(time);
    if (time === '' || time === null) return Infinity;
    let timeSections1 = time.split(/\:|\./g);
    let timeArray = timeSections1.map((v) => parseInt(v, 10));
    let timeInCSec = timeArray[0] * 6000 + timeArray[1] * 100 + timeArray[2];
    return timeInCSec;
  }
}
