import { Component } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {
  private faqExpand1: boolean;
  private faqExpand2: boolean;
  private faqExpand3: boolean;
  private faqExpand4: boolean;
  private faqExpand5: boolean;
  private faqExpand6: boolean;
  private faqExpand7: boolean;
  constructor(public navCtrl: NavController) {

  }
reset(){
  this.faqExpand1=false;
  this.faqExpand2=false;
  this.faqExpand3=false;
  this.faqExpand4=false;
  this.faqExpand5=false;
  this.faqExpand6=false;
  this.faqExpand7=false;
  }
     faqExpandToggle1() {
  this.reset();
    this.faqExpand1 = !this.faqExpand1;
  }

  faqExpandToggle2() {
  this.reset();
    this.faqExpand2 = !this.faqExpand2;
  }

  faqExpandToggle3() {
  this.reset();
    this.faqExpand3 = !this.faqExpand3;
  }
 
  faqExpandToggle4() {
  this.reset();
    this.faqExpand4 = !this.faqExpand4;
  }
  
  faqExpandToggle5() {
  this.reset();
    this.faqExpand5 = !this.faqExpand5;
  }
  
  faqExpandToggle6() {
  this.reset();
    this.faqExpand6 = !this.faqExpand6;
  }
  
  faqExpandToggle7() {
  this.reset();
    this.faqExpand7 = !this.faqExpand7;
  }


}
