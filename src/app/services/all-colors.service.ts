import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AllColorsService {
  //全色データ
  private chromaticHSL = [...Array(6)].map((_, index) => [
    [...Array(5)].map((_, s) =>
      [...Array(5)].map(
        (_, l) =>
          'hsl(' +
          index * 60 +
          ',' +
          (s + 1) * 20 +
          '%,' +
          ((l + 1) * 20 - 10) +
          '%)'
      )
    ),
  ]);
  private achromaticHSL = [...Array(5)].map(
    (_, index) => 'hsl(' + 0 + ',' + 0 + '%,' + index * 20 + '%)'
  );

  private allColorsHSL = () => {
    let linear = this.chromaticHSL.map((value, i) =>
      value.reduce((pre, val) => pre.concat(val))
    );
    let linear2 = linear.reduce((pre, str) => pre.concat(str));
    let linear3 = linear2.reduce((pre, str) => pre.concat(str));

    return linear3.concat(this.achromaticHSL);
  };

  private revisitGameData: Object = null;

  constructor() {}

  provideColorData() {
    return this.allColorsHSL();
  }

  provideOptions(revisit?: string): string[] {
    let buffer = this.allColorsHSL();

    //フィッシャーとイェーツによるアルゴリズム
    for (let i = buffer.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      buffer[i] = [buffer[j], (buffer[j] = buffer[i])][0];
    }

    //revisit問題であれば、先頭ｎ個以内にランダム交換
    if (revisit !== undefined) {
      if (this.revisitGameData === null) return buffer.slice(0, 25);

      /*
      let buffer = [...buffer].map((hslStr) => {
        let hsl = hslStr.split(/hsl\(|,|\%,|\%\)/g).slice(1, 4);
        let rgb = this.HSVtoRGB(hsl[0], hsl[1], hsl[2]);
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      });
*/
      let indexColor1 = buffer.indexOf(this.revisitGameData['answer1']);
      let indexColor2 = buffer.indexOf(this.revisitGameData['answer2']);

      if (indexColor1 > 25 || indexColor2 > 25) {
        let i = Math.floor(Math.random() * 25);
        buffer[i] = [buffer[indexColor1], (buffer[indexColor1] = buffer[i])][0];

        let j = Math.floor(Math.random() * 25);
        while (j === i) i = Math.floor(Math.random() * 25);
        buffer[j] = [buffer[indexColor2], (buffer[indexColor2] = buffer[j])][0];
        console.log({ indexColor1, indexColor2, i, j });
      }
    }

    return buffer.slice(0, 25);
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

  /**
   * 選択した復習問題データの一時保管
   * @param revisitGame
   */
  reserveTheGameData(revisitGame: Object) {
    this.revisitGameData = revisitGame;
  }

  /**
   * 選択した復習問題データの提供
   * @param revisitGame
   */
  provideTheGameData(): Object {
    return this.revisitGameData;
  }
}
