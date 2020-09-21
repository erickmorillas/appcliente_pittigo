import { Component } from '@angular/core';
import {IonicPage, NavController,MenuController } from 'ionic-angular';
import {PrLoginProvider} from '../../providers/pr-login/pr-login';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
/*import { TranslateService } from '@ngx-translate/core';*/
@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage{
  data_usuario={
    login:'',
    pass:'',
    token:'',
  }
  constructor(public navCtrl: NavController, public pr_login:PrLoginProvider, public pr_alert_toast:PrAlertToastProvider, public menu:MenuController){
  }
 ionViewWillEnter(){
  this.menu.enable(false);
 }
  signup(){
   this.navCtrl.push('SignupPage')
  }  
  verification(){
   this.navCtrl.push('VerificationPage')
  }
  login_usuario(){
    if(this.data_usuario.login==''){
       let mensaje='Ingrese email';
       this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }else if(this.data_usuario.pass==''){
      let mensaje='Ingrese contraseña';
       this.pr_alert_toast.mensaje_toast_pie(mensaje);
    }else{
      let token=this.pr_login.get_token();
      if(token==undefined || token==null) {
        this.data_usuario.token='1234';
      }else{
        this.data_usuario.token=token;
      }
       let mensaje='Cargando';
       this.pr_alert_toast.show_loading(mensaje);
       this.pr_login.get_usuario_login_pass(this.data_usuario).subscribe(
        pr_login=>{
        this.pr_alert_toast.dismis_loading();
          let resultado=pr_login;
          if(resultado.status==true){
            let data=resultado.data;
            let nivel;
            let id_estado_usuario;
             for(let value of data){
              nivel=value.id_nivel;
              id_estado_usuario=value.id_estado_usuario;
             }
             if(nivel==2){
               if(id_estado_usuario==2 || id_estado_usuario==3){
                 let mensaje='Te encuentras inactivo ';
                 this.pr_alert_toast.mensaje_toast_pie(mensaje);
               }else{
                localStorage.setItem('data_cliente_pitigo',JSON.stringify(data));
                localStorage.removeItem('lat_long_cliente_pitigo');
                this.menu.enable(true);
                this.navCtrl.setRoot('HomePage');
               }
             }else{
               let mensaje='Debes ser un cliente para poder iniciar sesión';
               this.pr_alert_toast.mensaje_toast_pie(mensaje);
             }
          }else{
            let mensaje='Login y contraseña no válidos';
            this.pr_alert_toast.mensaje_toast_pie(mensaje);
          }
        },
        err => {console.log('el error '+err);
        },
       );
    }
  }
  recupera_password(){
    this.navCtrl.push('RecuperarPasswordPage');
  }
}
