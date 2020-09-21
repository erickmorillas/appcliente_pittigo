import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Add_moneyPage } from './add_money';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Add_moneyPage,
  ],
  imports: [
    IonicPageModule.forChild(Add_moneyPage),
    TranslateModule.forChild()
  ],
})
export class Add_moneyPageModule {}