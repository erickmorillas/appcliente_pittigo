import { Component } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
import {PrCarreraProvider} from '../../providers/pr-carrera/pr-carrera';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
@IonicPage()

@Component({
  selector: 'page-my_trips',
  templateUrl: 'my_trips.html'
})
export class My_tripsPage {
	carreras:any;
	nombre:any;
  constructor(public navCtrl: NavController, public pr_carrera:PrCarreraProvider, public pr_alert_toast:PrAlertToastProvider){
  }
  trip_info(){
        this.navCtrl.push('Trip_infoPage')
  }
  ionViewDidLoad(){
  	this.get_carreras_id_usuario();
  	this.get_usuario();
  }
  
  get_usuario(){
  	let usuario=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
  	 for(let value of usuario){
  		this.nombre=value.fullname;
  	 }
  }
  get_carreras_id_usuario(){
  	let dato_u=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
  	let dato={
  		id_usuario:''
  	}
  	 for(let value of dato_u){
  		dato.id_usuario=value.id;
  	 }
  	  let mensaje='Cargando';
  	  this.pr_alert_toast.show_loading(mensaje);
  	  this.pr_carrera.get_carreras_id_usuario(dato).subscribe(
  	   pr_carrera=>{
  	   this.pr_alert_toast.dismis_loading();
  	     let resultado=pr_carrera;
  	     if(resultado.status==true){
  	       let data=resultado.data;
  	       console.log(data);
  	       this.carreras=data;
  	     }
  	   },
  	   err => {console.log('el error '+err);
  	   },
  	  );
  }

}
