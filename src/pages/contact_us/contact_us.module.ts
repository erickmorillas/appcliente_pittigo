import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Contact_usPage } from './contact_us';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Contact_usPage,
  ],
  imports: [
    IonicPageModule.forChild(Contact_usPage),
    TranslateModule.forChild()
  ],
})
export class Contact_usPageModule {}