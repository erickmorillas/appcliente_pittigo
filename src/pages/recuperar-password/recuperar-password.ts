import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PrLoginProvider} from '../../providers/pr-login/pr-login';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
@IonicPage()
@Component({
  selector: 'page-recuperar-password',
  templateUrl: 'recuperar-password.html',
})
export class RecuperarPasswordPage {
	data_usuario={
		email:'',
	}
  constructor(public navCtrl: NavController, public navParams: NavParams, public pr_login:PrLoginProvider, public pr_alert_toast:PrAlertToastProvider){
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperarPasswordPage');
  }
  recupera_password(){
  	if(this.data_usuario.email=='') {
  		let mensaje='Ingrese email';
  		this.pr_alert_toast.mensaje_toast_pie(mensaje);
  	}else{
  		 let mensaje='Cargando';
  		 this.pr_alert_toast.show_loading(mensaje);
  		 this.pr_login.recuperar_pass(this.data_usuario).subscribe(
  		  pr_login=>{
  		  this.pr_alert_toast.dismis_loading();
  		    let resultado=pr_login;
  		    if(resultado.status==true){
  		      /*let data=resultado.data;*/
  		      let mensaje='Revise su bandeja de entrada de email';
  		      this.pr_alert_toast.mensaje_toast_pie(mensaje);
            this.navCtrl.setRoot('SigninPage');
  		    }else{
  		    	let mensaje='Usuario no existe';
  		    	this.pr_alert_toast.mensaje_toast_pie(mensaje);
  		    }
  		  },
  		  err => {console.log('el error '+err);
  		  },
  		 );
  	}
  }

}
