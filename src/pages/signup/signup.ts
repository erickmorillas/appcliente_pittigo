import { Component,NgZone } from '@angular/core';
import {IonicPage, Platform, NavController, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrLoginProvider} from '../../providers/pr-login/pr-login';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { SMS } from '@ionic-native/sms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage{
	data_usuario={
		email:'',
		nombre:'',
		pass:'',
		pass2:'',
		telf:'',
		player_id:'',
	}
  confirmacion:any=1;
  ramdom:any;
  constructor(public navCtrl: NavController, public pr_alert_toast:PrAlertToastProvider, public pr_login:PrLoginProvider, public base64: Base64, public camera: Camera, public platform: Platform, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl:ToastController, public loadingCtrl:LoadingController, public sms:SMS, public zone:NgZone){
    let minimo=1;
    let maximo=10000;
    this.ramdom= 3853;/*Math.floor(Math.random()*maximo);*/
    console.log(this.ramdom);
  }
  add_money(){
    this.navCtrl.push('Add_moneyPage')
  }
  enviar_confirmacion_telf(){
    if(this.data_usuario.nombre==''){
      let mensaje='Ingrese nombre';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }else if(this.data_usuario.email==''){
      let mensaje='Ingrese Email';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }else if(this.data_usuario.pass==''){
      let mensaje='Ingrese password';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }else if(this.data_usuario.pass!=this.data_usuario.pass2){
      let mensaje='las contraseñas no coiciden';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }else if(this.data_usuario.telf==''){
       let mensaje='Ingrese numero de teléfono';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }
  }
  registro_usuario(){
  	if(this.data_usuario.nombre=='') {
  		let mensaje='Ingrese nombre';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
  	}else if(this.data_usuario.email==''){
      let mensaje='Ingrese Email';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
  	}else if(this.data_usuario.pass==''){
      let mensaje='Ingrese password';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
  	}else if(this.data_usuario.pass!=this.data_usuario.pass2){
      let mensaje='las contraseñas no coiciden';
      this.pr_alert_toast.mensaje_toast_pie(mensaje);
  	}else{
      if(this.data_usuario.telf==''){
        this.data_usuario.telf='ninguno';
      }
  		let token=this.pr_login.get_token();
  		if(token==null || token==undefined) {
  			this.data_usuario.player_id='1';
  		}else{
  			this.data_usuario.player_id=token;
  		}
       let mensaje='Cargando';
       this.pr_alert_toast.show_loading(mensaje);
       this.pr_login.guardar_usuario_cliente(this.data_usuario).subscribe(
        pr_login=>{
        this.pr_alert_toast.dismis_loading();
          let resultado=pr_login;
          if(resultado.status==true){
            /*let data=resultado.data;*/
            let mensaje='Revise su bandeja de entrada de email';
            this.pr_alert_toast.mensaje_toast_pie(mensaje);
            this.navCtrl.setRoot('SigninPage');
          }else{
            let mensaje='Usuario ya existe';
            this.pr_alert_toast.mensaje_toast_pie(mensaje);
          }
        },
        err => {console.log('el error '+err);
        },
       );
  	}
  }  
}
