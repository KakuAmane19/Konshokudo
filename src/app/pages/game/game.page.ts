import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { times } from '../../pipes/times.pipe';

const time$ = timer(3000);

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  private selectedColor = false;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {}

  ngDoCheck() {
    //time$.subscribe(() => this.router.navigateByUrl('/result'));
  }

  selectColor() {
    let selectedColor = dom.renderer.createElement('button');

    this.renderer.setAttribute(btn, 'name', 'btnName');
    this.renderer.addClass(btn, 'className');
    this.renderer.setStyle(btn, 'width', '150px');

    this.renderer.appendChild(btn, text);
    this.renderer.appendChild(this.test2.nativeElement, btn);

    this.renderer.listen(btn, 'click', (event) => {
      this.renderer.removeChild(this.test2.nativeElement, btn);
    });
  }
}
