import { Injectable } from '@angular/core';
import {AlertController,ToastController,LoadingController } from 'ionic-angular';

@Injectable()
export class PrAlertToastProvider {
	loader:any;
  constructor(public alertCtrl:AlertController, public toastCtrl:ToastController, public loadingCtrl:LoadingController){
   console.log('Hello PrAlertToastProvider Provider');
  }
  show_alert(titulo,mensaje){
     let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['OK']
      });
      alert.present();
  }
  mensaje_toast_medio(valor){
    let toast = this.toastCtrl.create({
        message: valor,
        duration: 3000,
        position: 'middle'
      });
      toast.present();
  }
  mensaje_toast_pie(valor){
    let toast = this.toastCtrl.create({
        message: valor,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
  }
   show_loading(item) {
      this.loader = this.loadingCtrl.create({
          content: item
      });
      this.loader.present();
   }
   dismis_loading(){
     this.loader.dismiss();
   }

}
