import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AllColorsService {
  //色オブジェクト
  private hueList: string[] = [
    'red',
    'magenta',
    'blue',
    'syan',
    'green',
    'yellow',
  ];
  private color = {
    selected: false,
    hue: '',
    color: 'hsl(0,0,0)',
  };
  //全色データ
  private allColorsHSL = this.hueList.map((h, i) => [
    h,
    [...Array(6)].map((_, s) =>
      [...Array(6)].map(
        (_, l) => 'hsl(' + i * 30 + '%,' + s * 20 + '%,' + l * 20 + '%)'
      )
    ),
  ]);

  constructor() {}

  provideColorData() {
    return this.allColorsHSL;
  }
}
