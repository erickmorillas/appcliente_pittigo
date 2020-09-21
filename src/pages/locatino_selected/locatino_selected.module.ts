import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Locatino_selectedPage } from './locatino_selected';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Locatino_selectedPage,
  ],
  imports: [
    IonicPageModule.forChild(Locatino_selectedPage),
    TranslateModule.forChild()
  ],
})
export class Locatino_selectedPageModule {}