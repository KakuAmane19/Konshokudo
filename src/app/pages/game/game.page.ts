import { CssSelector } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

const time$ = timer(3000);

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  public currentIndex: Array<number> = [-1, -1];
  selectee = {
    //filter: 'drop-shadow(0 0 0.75rem yellow)',
    selectedColor: false,
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  ngDoCheck() {
    //time$.subscribe(() => this.router.navigateByUrl('/result'));
  }

  selectColorY(i: number) {
    this.currentIndex[1] = i;
    this.selectee.selectedColor = this.selectee.selectedColor ? false : true;
    console.log(this.currentIndex, this.selectee.selectedColor);
  }

  selectColorX(i: number) {
    this.currentIndex[0] = i;
  }

  getColorY() {
    return this.currentIndex[1];
  }

  getColorX(x: number) {
    if (x === this.currentIndex[0]) return x;
  }
}
