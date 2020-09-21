import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Rate_ridePage } from './rate_ride';
import { TranslateModule } from '@ngx-translate/core';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    Rate_ridePage,
  ],
  imports: [
    IonicPageModule.forChild(Rate_ridePage),
    TranslateModule.forChild(),
    Ionic2RatingModule
  ],
})
export class Rate_ridePageModule {}