import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Trip_infoPage } from './trip_info';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Trip_infoPage,
  ],
  imports: [
    IonicPageModule.forChild(Trip_infoPage),
    TranslateModule.forChild()
  ],
})
export class Trip_infoPageModule {}