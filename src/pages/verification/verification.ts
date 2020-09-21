import { Component } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html'
})
export class VerificationPage {

  constructor(public navCtrl: NavController) {

  }
   
  add_money(){
        this.navCtrl.push('Add_moneyPage')
  }  

}
