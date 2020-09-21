import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerificationPage } from './verification';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(VerificationPage),
    TranslateModule.forChild()
  ],
})
export class VerificationPageModule {}