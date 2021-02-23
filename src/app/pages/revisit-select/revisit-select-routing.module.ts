import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisitSelectPage } from './revisit-select.page';

const routes: Routes = [
  {
    path: '',
    component: RevisitSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisitSelectPageRoutingModule {}
