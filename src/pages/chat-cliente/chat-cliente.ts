import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrMensajeProvider} from '../../providers/pr-mensaje/pr-mensaje';
import * as firebase from 'firebase'
@IonicPage()
@Component({
  selector: 'page-chat-cliente',
  templateUrl: 'chat-cliente.html',
})
export class ChatClientePage {
  @ViewChild(Content) content: Content;
	mensajes:any[]=[];
	id_usuario:any;nombre_usuario:any;
  id_usuario_conductor:any;
	data_mensaje:any='';
  id_carrera:any;
  token:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public pr_alert_toast:PrAlertToastProvider, public pr_mensaje:PrMensajeProvider){
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad ChatConductorPage');
    this.get_mensajes();
  }
  atras(){
  	this.navCtrl.pop();	
  }
   /*filtro los mensajes directos*/
  get_mensajes(){
  this.mensajes=[];
  let data_u=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
  console.log(data_u);
   for(let value of data_u){
    this.nombre_usuario=value.fullname;
  	this.id_usuario=value.id;
   }
  console.log(this.nombre_usuario);
  let datos=JSON.parse(localStorage.getItem('carrera_aceptada_pitigo'));
  console.log(datos);
   for(let value of datos.datos_carrera){
  		this.id_carrera=value.id_carrera;
   }
  for(let value of datos.datos_conductor){
  		this.id_usuario_conductor=value.id_usuario;
      this.token=value.player_id;
  }
  console.log(this.id_usuario_conductor);
   var starCountRef = firebase.database().ref('chat_cliente_conductor');
   let query=starCountRef
   /* orderByChild la columna que necesito trabajar*/
   /* equalTo el valor que le está enviando para que lo filtre*/
   .orderByChild('id_carrera')
   .equalTo(this.id_carrera);
    query.on('value', (snap)=>{
      console.log(snap);
      this.mensajes=[];
       var data=snap.val();
       for(var key in data){
        this.mensajes.push(data[key]);
       }
       console.log(this.mensajes);
       let dimensions = this.content.getContentDimensions();
       this.content.scrollTo(0, dimensions.contentHeight+100, 100);
    });
  }
  /*****************************/
  enviar_mensaje(){
  	if(this.data_mensaje==''){
  		let mensaje='Ingrese un mensaje';
  		this.pr_alert_toast.mensaje_toast_pie(mensaje);
  	}else{
  		let datos=JSON.parse(localStorage.getItem('carrera_aceptada_pitigo'));
  		console.log(datos);
      let id_carrera;
      for(let value of datos.datos_carrera){
  			id_carrera=value.id_carrera;
   		}
      let data_envia_mensaje={
        id_carrera:id_carrera,
        id_usuario_envia:this.id_usuario,
        id_usuario_recibe:this.id_usuario_conductor,
        nombre:this.nombre_usuario,
        mensaje:this.data_mensaje,
        token:this.token
      };
      console.log(data_envia_mensaje);
       let mensaje='Enviando mensaje';
       this.pr_alert_toast.show_loading(mensaje);
	    var messagesRef= firebase.database().ref().child("chat_cliente_conductor");
	    messagesRef.push({
	      id_carrera:id_carrera,
        id_usuario_envia:this.id_usuario,
        id_usuario_recibe:this.id_usuario_conductor,
        nombre:this.nombre_usuario,
        mensaje:this.data_mensaje
	    });
       this.pr_mensaje.enviar_mensaje(data_envia_mensaje).subscribe(
        pr_mensaje=>{
          this.pr_alert_toast.dismis_loading();
	    	  this.data_mensaje='';
          let resultado=pr_mensaje;
          if(resultado.status==true){
	    			this.data_mensaje='';
          }
        },
        err => {console.log('el error '+err);
        },
       );
  	};
  }

}
