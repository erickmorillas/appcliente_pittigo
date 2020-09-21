import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Searchin_cabPage } from './searchin_cab';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Searchin_cabPage,
  ],
  imports: [
    IonicPageModule.forChild(Searchin_cabPage),
    TranslateModule.forChild()
  ],
})
export class Searchin_cabPageModule {}