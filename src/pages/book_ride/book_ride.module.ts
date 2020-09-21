import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Book_ridePage } from './book_ride';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Book_ridePage,
  ],
  imports: [
    IonicPageModule.forChild(Book_ridePage),
    TranslateModule.forChild()
  ],
})
export class Book_ridePageModule {}