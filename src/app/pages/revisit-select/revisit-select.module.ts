import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisitSelectPageRoutingModule } from './revisit-select-routing.module';

import { RevisitSelectPage } from './revisit-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisitSelectPageRoutingModule
  ],
  declarations: [RevisitSelectPage]
})
export class RevisitSelectPageModule {}
