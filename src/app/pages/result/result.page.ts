import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  //今回のタイム
  public record: string;
  //ランキング
  public rankings;

  constructor(
    private recordService: RecordService,
    public alertController: AlertController
  ) {}

  async ngOnInit() {
    //今回のリザルト表示
    this.record = this.recordService.provideTotalTime();
    //リザルト20位以内?アラートを表示（）
    if (this.recordService.rankin()) {
      await this.presentAlertPrompt();
    } else {
      this.rankings = await this.recordService.provideRanking();
    }
  }

  ionViewDidLeave() {
    this.recordService.reset();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '上位20位にランクインしました！',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: '',
          placeholder: 'Pleas enter your name.',
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: async (text: string) => {
            console.log(text);
            await this.recordService.saveRanking(text);
            this.rankings = await this.recordService.provideRanking();
            text = '';
          },
        },
      ],
    });

    await alert.present();
  }
}
