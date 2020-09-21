import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninPage } from './signin';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninPage),
    TranslateModule.forChild()
  ],
})
export class SigninPageModule {}