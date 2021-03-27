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

  private revisitGameData: Object;

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
      //答え1のインデックスを確保
      //答え2のインデックスを確保
      //もし答え1のインデックスまたは答え2のインデックスが先頭25以上のとき
      //答え1と先頭25個のうち1つ交換
      //答え2と残りの先頭24個のうち一つを交換
    }

    return buffer.slice(0, 25);
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
