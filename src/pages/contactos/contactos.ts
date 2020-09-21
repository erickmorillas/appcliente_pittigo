import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';


@IonicPage()
@Component({
  selector: 'page-contactos',
  templateUrl: 'contactos.html',
})
export class ContactosPage {

	contactos:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController, public pr_alert_toast:PrAlertToastProvider) {
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad ContactosPage');
    this.get_contactos();
  }
  get_contactos(){
  	this.contactos=JSON.parse(localStorage.getItem('contactos_pitigo_clientes'));
  	console.log(this.contactos);
  }
  agregar_contacto(){
  	 let alert = this.alertCtrl.create({
    title: 'Nuevo contacto',
    inputs: [
      {
        name: 'nombre',
        placeholder: 'Ingrese nombre'
      },
      {
        name: 'telefono',
        placeholder: 'Ingrese telefono',
        type: 'text'
      },
      {
        name: 'email',
        placeholder: 'Ingrese un email',
        type: 'text'
      }

    ],
    buttons: [
      {
        text: 'Guardar',
        handler: data =>{
         if(data.nombre=='') {
         	let mensaje='Ingrese un nombre';
         	this.pr_alert_toast.mensaje_toast_pie(mensaje);
         }else if(data.telefono==''){
         	let mensaje='Ingrese un Teléfono';
         	this.pr_alert_toast.mensaje_toast_pie(mensaje);
         }else if(data.email==''){
         	let mensaje='Ingrese un correo electrónico';
         	this.pr_alert_toast.mensaje_toast_pie(mensaje);
         }else{
         	let item=data;
         	this.guardar_contacto(item);
         }
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  alert.present();
  }
  guardar_contacto(item){
  	let dato=item;
  	let _guardar_contacto:any[]=[];
  	let contactos=JSON.parse(localStorage.getItem('contactos_pitigo_clientes'));
  	if(contactos!=undefined || contactos!= null){
  		 for(let value of contactos){
  			_guardar_contacto.push({
					nombre:value.nombre,
					telefono:value.telefono,
					email:value.email,
  			});
  		 }
  		 _guardar_contacto.push({
					nombre:dato.nombre,
					telefono:dato.telefono,
					email:dato.email,
  			});
  	}else{
		 _guardar_contacto.push({
				nombre:dato.nombre,
				telefono:dato.telefono,
				email:dato.email,
			});
  	}
  	localStorage.setItem('contactos_pitigo_clientes',JSON.stringify(_guardar_contacto));
  	this.get_contactos();
  }
  borrar(item){
   let telef=item;
   let i=0;
   for(let value of this.contactos){
		  if(telef==value.telefono){
		  	this.contactos.splice(i, 1);
		  }
		  i++;
   }
   localStorage.setItem('contactos_pitigo_clientes',JSON.stringify(this.contactos));
   this.get_contactos();
  }

}
