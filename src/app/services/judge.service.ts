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

  /**
   * HSV配列 を RGB配列 へ変換します
   *
   * @param   {Number}  h         hue値        ※ 0〜360の数値
   * @param   {Number}  s         saturation値 ※ 0〜255 の数値
   * @param   {Number}  v         value値      ※ 0〜255 の数値
   * @return  {Object}  {r, g, b} ※ r/g/b は 0〜255 の数値
   */
  HSVtoRGB(h, s, v) {
    let r, g, b; // 0..255

    while (h < 0) {
      h += 360;
    }

    h = h % 360;

    // 特別な場合 saturation = 0
    if (s == 0) {
      // → RGB は V に等しい
      v = Math.round(v);
      return [v, v, v];
    }

    s = s / 255;

    let i = Math.floor(h / 60) % 6,
      f = h / 60 - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s);

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  constructor() {}
}
