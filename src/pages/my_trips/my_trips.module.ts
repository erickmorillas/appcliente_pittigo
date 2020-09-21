import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { My_tripsPage } from './my_trips';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    My_tripsPage,
  ],
  imports: [
    IonicPageModule.forChild(My_tripsPage),
    TranslateModule.forChild()
  ],
})
export class My_tripsPageModule {}