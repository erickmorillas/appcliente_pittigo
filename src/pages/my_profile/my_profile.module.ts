import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { My_profilePage } from './my_profile';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    My_profilePage,
  ],
  imports: [
    IonicPageModule.forChild(My_profilePage),
    TranslateModule.forChild()
  ],
})
export class My_profilePageModule {}