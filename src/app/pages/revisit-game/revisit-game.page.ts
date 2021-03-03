import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

const time$ = timer(3000);

@Component({
  selector: 'app-revisit-game',
  templateUrl: './revisit-game.page.html',
  styleUrls: ['./revisit-game.page.scss'],
})
export class RevisitGamePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  ngDoCheck() {
    //time$.subscribe(() => this.router.navigateByUrl('/revisit-select'));
  }
}
