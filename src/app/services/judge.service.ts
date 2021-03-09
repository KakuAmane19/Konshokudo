import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JudgeService {
  /********
   * 引数で受け取った色（数値）があっているか判定する
   * @param q 問題色
   * @param a 答案色
   * @return true=正解 false=不正解:boolean
   */
  judge(q, a): boolean {
    if (q && a && q.toString() === a.toString()) return true;

    return false;
  }

  constructor() {}
}
