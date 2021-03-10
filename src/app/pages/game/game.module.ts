import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { TimesPipe } from '../../pipes/times.pipe';

import { AllColorsService } from '../../services/all-colors.service';
import { JudgeService } from '../../services/judge.service';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  declarations: [GamePage, TimesPipe],
  providers: [AllColorsService, JudgeService],
})
export class GamePageModule {}
