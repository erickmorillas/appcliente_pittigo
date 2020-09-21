import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchInicioPage } from './search-inicio';

@NgModule({
  declarations: [
    SearchInicioPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchInicioPage),
  ],
})
export class SearchInicioPageModule {}
