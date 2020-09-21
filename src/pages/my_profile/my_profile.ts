import { Component } from '@angular/core';
import {IonicPage,Platform, NavController,ActionSheetController,LoadingController, ToastController } from 'ionic-angular';
import {PrRutasProvider} from '../../providers/pr-rutas/pr-rutas';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrLoginProvider} from '../../providers/pr-login/pr-login';
import { File } from '@ionic-native/file';
/*import { Transfer } from '@ionic-native/transfer';*/
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';
declare var cordova;
@IonicPage()
@Component({
  selector: 'page-my_profile',
  templateUrl: 'my_profile.html'
})
export class My_profilePage {
	data_usuario:any={
		id:'',
		nombre:'',
		email:'',
		pass:'',
		imagen:''
	};
	ruta_imagenes:any;
	pass1:any;
	pass2:any;
	imagen_licencia:any={
    id_usuario:'',
    photo:'',
  };
  licencia:any;
  imagen:any;
  valor:any=0;
  constructor(public navCtrl: NavController, public pr_rutas:PrRutasProvider,public pr_alert_toast:PrAlertToastProvider, public pr_login:PrLoginProvider, public base64: Base64, public camera: Camera, public platform: Platform, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl:ToastController, public loadingCtrl:LoadingController, private _domsanitizer: DomSanitizer){
  	this.ruta_imagenes=this.pr_rutas.get_ruta_imagenes();
  }
  ionViewDidLoad(){
  	this.usuario();
  }
  usuario(){
   let data_u=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
  	for(let value of data_u){
  		this.data_usuario.id=value.id;
  		this.data_usuario.nombre=value.fullname;
  		this.data_usuario.pass=value.password;
  		 if(value.imagen_usuario!=null){
         this.valor=1;
         this.imagen=(value.imagen_usuario as string);
       }else{
         this.valor=0;
         this.imagen=null;
       }
  		this.data_usuario.email=value.email;
  	}
  }
  cambiar_imagen(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Seleccione Imagen',
      buttons: [
        {
          text: 'Desde Galeria',
          handler: () => {
            this.toma_foto_licencia_conducir(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Desde Camara',
          handler: () => {
            this.toma_foto_licencia_conducir(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

public toma_foto_licencia_conducir(sourceType){
      // Create options for the Camera Dialog
      var options = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      // Get the data of an image
      this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir_licencia_conducir(correctPath, currentName, this.createFileName());
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir_licencia_conducir(correctPath, currentName, this.createFileName());
        }
      }, (err) => {  

        this.presentToast('Error');
      });
  }
  private copyFileToLocalDir_licencia_conducir(namePath, currentName, newFileName){
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.licencia = newFileName;
    console.log(this.licencia);
    this.subir_imagen_licencia_conducir();
  }, error => {
    this.presentToast('Error while storing file.');
  });
	}
	subir_imagen_licencia_conducir(){
	  // File for Upload
	  var targetPath = this.pathForImage(this.licencia);
	  console.log(targetPath);
	  this.base64.encodeFile(targetPath).then((base64File: string) => {
	   console.log(base64File);
	  /* let base=base64File.split('data:image/*;charset=utf-8;base64,')*/
	   this.imagen_licencia.photo=base64File;
	   this.actualizar_imagen_usuario();
	    },(err) =>{
	    console.log(err);
	    });
  }
		// Always get the accurate path to your apps folder
	public pathForImage(img){
	  if (img === null) {
	    return '';
	  } else {
	    return cordova.file.dataDirectory + img;
	  }
	 }
	private presentToast(text){
	  let toast = this.toastCtrl.create({
	    message: text,
	    duration: 3000,
	    position: 'top'
	  });
	  toast.present();
	}
	private createFileName(){
	  var d = new Date(),
	  n = d.getTime(),
	  newFileName =  n + ".jpg";
	  return newFileName;
	}
	actualizar_imagen_usuario(){
   let dato_u=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
    for(let value of dato_u){
   		this.imagen_licencia.id_usuario=value.id;
    }
   let mensaje='Guardando imagen';
   this.pr_alert_toast.show_loading(mensaje)
    this.pr_login.actualizar_imagen_usuario(this.imagen_licencia).subscribe(
     pr_login=>{
       this.pr_alert_toast.dismis_loading();
      let resultado=pr_login;
      if(resultado.status==true){
      	let mensaje='Imagen guardada inicie sesión';
   		  this.pr_alert_toast.mensaje_toast_pie(mensaje);
        localStorage.removeItem('data_cliente_pitigo');
        this.navCtrl.setRoot('SigninPage');
      }
     },
     err => {console.log('el error '+err);
     },
    );
   }
   actualizar_password(){
   	if(this.pass1=='') {
   		let mensaje='Ingrese password';
   		this.pr_alert_toast.mensaje_toast_pie(mensaje);
   	}else if(this.pass1!=this.pass2){
   		let mensaje='Las contraseña no coinciden';
   		this.pr_alert_toast.mensaje_toast_pie(mensaje);
   	}else{
   		let dato_u=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
   		let data_g={
   			pass:this.pass1,
   			id_usuario:'',
   		}
    for(let value of dato_u){
   		data_g.id_usuario=value.id;
    }
   		 let mensaje='Guardando';
   		 this.pr_alert_toast.show_loading(mensaje);
   		 this.pr_login.actualizar_password(data_g).subscribe(
   		  pr_login=>{
   		  this.pr_alert_toast.dismis_loading();
   		    let resultado=pr_login;
   		    if(resultado.status==true){
   		     /* let data=resultado.data;*/
   		      let mensaje='Password cambiado inicie sesión';
   		      this.pr_alert_toast.mensaje_toast_pie(mensaje);
						localStorage.removeItem('data_cliente_pitigo');
						this.navCtrl.setRoot('SigninPage');
   		    }
   		  },
   		  err => {console.log('el error '+err);
   		  },
   		 );
   	}
   }
}
