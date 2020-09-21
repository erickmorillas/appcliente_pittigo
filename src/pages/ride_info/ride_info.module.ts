import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ride_infoPage } from './ride_info';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Ride_infoPage,
  ],
  imports: [
    IonicPageModule.forChild(Ride_infoPage),
    TranslateModule.forChild()
  ],
})
export class Ride_infoPageModule {}