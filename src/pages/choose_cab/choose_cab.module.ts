import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Choose_cabPage } from './choose_cab';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Choose_cabPage,
  ],
  imports: [
    IonicPageModule.forChild(Choose_cabPage),
    TranslateModule.forChild()
  ],
})
export class Choose_cabPageModule {}