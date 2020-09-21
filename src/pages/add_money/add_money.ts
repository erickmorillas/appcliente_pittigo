import { Component } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-add_money',
  templateUrl: 'add_money.html'
})
export class Add_moneyPage{
  constructor(public navCtrl: NavController) {
  }
  home(){
    this.navCtrl.setRoot('HomePage')
  }
}
