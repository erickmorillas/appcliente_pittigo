import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Promo_codePage } from './promo_code';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Promo_codePage,
  ],
  imports: [
    IonicPageModule.forChild(Promo_codePage),
    TranslateModule.forChild()
  ],
})
export class Promo_codePageModule {}