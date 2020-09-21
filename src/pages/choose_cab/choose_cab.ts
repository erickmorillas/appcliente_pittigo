import { Component } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-choose_cab',
  templateUrl: 'choose_cab.html'
})
export class Choose_cabPage {

  constructor(public navCtrl: NavController) {

  }
   
  searchin_cab(){
        this.navCtrl.push('Searchin_cabPage')
  }

}
 