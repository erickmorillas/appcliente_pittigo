import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecuperarPasswordPage } from './recuperar-password';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecuperarPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(RecuperarPasswordPage),
    TranslateModule.forChild()
  ],
})
export class RecuperarPasswordPageModule {}
