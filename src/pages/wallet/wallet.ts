import { Component } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage {
  constructor(public navCtrl: NavController) {
  }
  add_money(){
    this.navCtrl.push('Add_moneyPage')
  }  

}
