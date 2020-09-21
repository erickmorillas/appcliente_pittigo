import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import {TranslateService} from '../../node_modules/@ngx-translate/core';
import {PrLoginProvider} from '../providers/pr-login/pr-login';
import {PrRutasProvider} from '../providers/pr-rutas/pr-rutas';
import { DomSanitizer } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = (localStorage.getItem('data_cliente_pitigo')) ? 'HomePage' : 'SigninPage';
  pages: Array<{title: string, component: any}>;
  nombre:any;
  ruta_imagenes:any;
  imagen:any;
  constructor(private platform: Platform, private statusBar:  StatusBar, private splashScreen: SplashScreen, public translate:TranslateService, public oneSignal:OneSignal, public pr_login:PrLoginProvider, public alertCtrl:AlertController, public events:Events, public pr_rutas:PrRutasProvider,  private _domsanitizer: DomSanitizer,public menu:MenuController, private androidPermissions: AndroidPermissions){
    this.ruta_imagenes=this.pr_rutas.get_ruta_imagenes();
    this.initializeApp();
  } 
  initializeApp(){
    this.platform.ready().then(()=>{
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.usuario();
      this.permisoSms();
      if (this.platform.is('cordova')){
          this.notificaciones();
       }else{
         this.pr_login.set_token(1);
       }
      this.translate.setDefaultLang('es');
      this.translate.use('es');
    });
  }
  permisoSms(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
    .then( success =>{
    console.log('Permiso concedido');
    },err => {console.log('no tiene permiso');
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE) 
    }
    );
  }
  openPage(page){
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  usuario(){
    this.events.subscribe('usuario', (item) =>{
      if(item==1){
       let usuario=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
       for(let value of usuario){
        this.nombre=value.fullname;
        this.imagen=value.imagen_usuario;
        if(this.imagen!=null){
          this.imagen=(value.imagen_usuario as string);
        }else{
          this.imagen=null;
        }
       }
       this.menu.enable(true,'el-menu');
      }
    });
  }
  notificaciones(){
   this.oneSignal.startInit('82673da1-bf68-40bf-a8cb-6c9f1d62c084', '241832247477'); //(appId_onesignal,googleProjectNumber)
   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
   this.oneSignal.enableSound(true);
   this.oneSignal.enableVibrate(true);
   this.oneSignal.handleNotificationOpened()
  .subscribe(jsonData =>{
    let alert = this.alertCtrl.create({
        title: jsonData.notification.payload.title,
        subTitle: jsonData.notification.payload.body,
        buttons: ['OK']
      });
      alert.present();
  console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  });
  this.oneSignal.endInit();
  this.oneSignal.getIds().then((id)=>{
    let el_id=id.userId; /*el id para guardarlo en el token de la base de datos*/
    this.pr_login.set_token(el_id);
    /*this.pr_login.set_serial(this.device.uuid);*/
  })
  }
  home(){
  this.nav.setRoot('HomePage');
  } 
  my_profile(){
  this.nav.setRoot('My_profilePage');
  } 
  my_trips(){
  this.nav.setRoot('My_tripsPage');
  } 
  wallet(){
  this.nav.setRoot('WalletPage');
  } 
  promo_code(){
  this.nav.setRoot('Promo_codePage');
  } 
  help(){
  this.nav.setRoot('HelpPage');
  } 
  Contactos(){
  this.nav.setRoot('ContactosPage');
  } 
  contact_us(){
  this.nav.setRoot('Contact_usPage');
  } 
  cerrar_sesion(){
    localStorage.removeItem('data_cliente_pitigo');
    this.nav.setRoot('SigninPage');
  }
}
