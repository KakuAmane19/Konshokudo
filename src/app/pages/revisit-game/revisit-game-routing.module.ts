import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisitGamePage } from './revisit-game.page';

const routes: Routes = [
  {
    path: '',
    component: RevisitGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisitGamePageRoutingModule {}
