import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisitGamePageRoutingModule } from './revisit-game-routing.module';

import { RevisitGamePage } from './revisit-game.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisitGamePageRoutingModule,
    SharedModule,
  ],
  declarations: [RevisitGamePage],
})
export class RevisitGamePageModule {}
