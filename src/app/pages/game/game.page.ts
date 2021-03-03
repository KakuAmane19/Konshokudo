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
  private selectedColor = false;
  public currentIndex: Array<number> = [-1, -1];

  constructor(private router: Router) {}

  ngOnInit() {}

  ngDoCheck() {
    console.log(this.currentIndex);
    //time$.subscribe(() => this.router.navigateByUrl('/result'));
  }

  selectColor(i: number) {
    this.currentIndex[0] === -1
      ? (this.currentIndex[0] = i)
      : (this.currentIndex[1] = i);
    console.log(this.currentIndex);
  }
}
