import { Component,ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavController, AlertController } from 'ionic-angular';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrTarifaProvider} from '../../providers/pr-tarifa/pr-tarifa';
import {PrRutasProvider} from '../../providers/pr-rutas/pr-rutas';
import {PrCodigoPromoProvider} from '../../providers/pr-codigo-promo/pr-codigo-promo';
import { Geolocation } from '@ionic-native/geolocation';
import { Geocoder } from '@ionic-native/google-maps';
import {PrCarreraProvider} from '../../providers/pr-carrera/pr-carrera';
import {PrComentarioProvider} from '../../providers/pr-comentario/pr-comentario';
import { NativeGeocoder} from '@ionic-native/native-geocoder';
import { DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase';
declare var google;
@IonicPage()
@Component({
  selector: 'page-rate_ride',
  templateUrl: 'rate_ride.html'
})
export class Rate_ridePage {
	@ViewChild('mapa') mapElement: ElementRef;
	estilo_mapa:any;
	fecha:any;
  map: any;
  id_tipo_tarifa:any;
  precio_tarifa:any;
  taxis_disponibles:any[]=[];
  mark_array:any[]=[]; /*este es el que guarda la ubicacion de cada uno para que lo muestre en agregar markers ojo*/
  arranque_markers=0;
  lat_long:any;
  calle:any;
  latitud:any;
  longitud:any;
  data_calificar={
    puntaje:'',
    comentario:'',
    codigo_descuento:null,
  }
  conductor:any={
    id_usuario:'',
    nombre:'',
    imagen:'',
    telefono:'',
    tipo_vehiculo:'',
    marca_vehiculo:'',
    modelo_vehiculo:'',
    placa_vehiculo:'',
  }
  desde:any;
  hasta:any;
  tipo_pago:any;
  distancia:any;
  tiempo:any;
  id_carrera:any;
  ruta_imagenes:any;
  pago:any;
  hora:any;
  lat_long_inicio:any;
  lat_long_fin:any;
  imagen:any=0;
  valor:any=0;
  codigo_generado={
   id_usuario:'',
   id_tipo_cupon:0,
   id_codigo:'',
   descuento:'',
  }
  monto_descuento:any;
  total:any;
  descuento:any;
  descuento_aplicado:any;
  tipo_cupon:any;
  pago_codigo_descuento:any;
  constructor(public navCtrl: NavController, public pr_alert_toast:PrAlertToastProvider, public geolocation:Geolocation, public pr_tarifa:PrTarifaProvider,public nativeGeocoder:NativeGeocoder, public geocoder:Geocoder, public pr_rutas:PrRutasProvider, public pr_carrera:PrCarreraProvider, public pr_comentario:PrComentarioProvider, public _domsanitizer:DomSanitizer, public pr_codigo_promo:PrCodigoPromoProvider, public alertCtrl:AlertController){
    this.ruta_imagenes=this.pr_rutas.get_ruta_imagenes();
  	var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  	let fecha_actual=(new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + 'Z';
  	console.log(fecha_actual);
  	this.fecha=fecha_actual;
  	let fecha_sola=this.fecha.split('T');
  	let fecha_siete=Date.parse(fecha_sola['0']+' 19:00');
  	let fecha_actual_2=Date.parse(fecha_actual);
  	if(fecha_actual_2>fecha_siete){
      this.id_tipo_tarifa=1;
  		console.log('mayor');
  		this.estilo_diurno();
  		console.log(this.estilo_mapa);
  	}else{
      this.id_tipo_tarifa=2;
  		console.log('menor');
  		this.estilo_nocturno();
  		console.log(this.estilo_mapa);
  	}
  }
  ionViewDidLoad(){
  	 this.ubicacion_cliente();
     this.datos_carrera();
  }

   ubicacion_cliente(){
    this.geolocation.getCurrentPosition().then((resp) =>{
       this.lat_long=resp.coords.latitude+','+resp.coords.longitude;
       this.latitud=resp.coords.latitude;
       this.longitud=resp.coords.longitude;
       localStorage.setItem('lat_long_cliente_pitigo',JSON.stringify(this.lat_long));
       setTimeout(()=>{
        this.loadMap();
        },1000);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
  }
  loadMap(){
   /* let lat_long_2=lat_long.split(',');*/
    let latLng = new google.maps.LatLng(this.latitud,this.longitud);
    this.lat_long=latLng;
    console.log(this.lat_long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
  datos_carrera(){
    let carrera=JSON.parse(localStorage.getItem('carrera_aceptada_pitigo'));
    console.log(carrera);
     for(let value of carrera.datos_conductor){
      this.conductor.id_usuario=value.id_usuario;
      this.conductor.nombre=value.nombre;
      this.conductor.imagen=value.imagen;
      this.conductor.telefono=value.telefono;
      this.conductor.tipo_vehiculo=value.tipo_vehiculo;
      this.conductor.marca_vehiculo=value.marca_vehiculo;
      this.conductor.modelo_vehiculo=value.modelo_vehiculo;
      this.conductor.placa_vehiculo=value.placa_vehiculo;
      if(value.calificacion==null){
        this.conductor.calificacion=5;
      }else{
        this.conductor.calificacion=value.calificacion;
      }
       if(value.imagen!=null){
         this.imagen=(value.imagen as string);
         this.valor=1;
      }else{
         this.valor=0;
         this.imagen=null;
      }
     }
     for(let value of carrera.datos_carrera){
       this.desde=value.desde;
       this.hasta=value.hasta;
       this.tipo_pago=value.tipo_pago;
       this.distancia=value.distancia;
       this.id_carrera=value.id_carrera;
       this.hora=value.hora;
       this.lat_long_inicio=value.lat_long_inicio;
       this.lat_long_fin=value.lat_long_fin;
       this.tiempo=value.tiempo;
       this.pago=value.monto;
     }
  }

  guardar_carrera(){
    localStorage.removeItem('envio_mensaje_6_pitigo');
    localStorage.removeItem('envio_mensaje_3_pitigo');
    if(this.data_calificar.comentario==''){
      this.data_calificar.comentario='Ninguno';
    }
    let usuario=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
    let fecha_sola=this.fecha.split('T');
    let datos_carrera={
      id_usuario_cliente:'',
      email:'',
      id_usuario_conductor:this.conductor.id_usuario,
      desde:this.desde,
      hacia:this.hasta,
      fecha:fecha_sola['0'],
      hora_i:this.hora,
      hora_f:'0',
      tiempo_trans:this.tiempo,
      lat_lng_i:this.lat_long_inicio,
      lat_lng_f:this.lat_long_fin,
      monto:this.pago,
      descuento:'0',
      monto_real:this.pago,
      observacion_cliente:'',
      observacion_conductor:'',
    }
    for(let value of usuario){
      datos_carrera.id_usuario_cliente=value.id;
      datos_carrera.email=value.email;
    }
    let puntaje_comentario={
      id_usuario:datos_carrera.id_usuario_conductor,
      puntaje:this.data_calificar.puntaje,
      comentario:this.data_calificar.comentario
    }
    if(this.data_calificar.codigo_descuento!=null){
       let mensaje='verificando código de descuento';
       let datos_codigo_descuento={
         id_usuario:datos_carrera.id_usuario_cliente,
         codigo:this.data_calificar.codigo_descuento,
       }
       this.pr_alert_toast.show_loading(mensaje);
       this.pr_codigo_promo.verificar_codigo_promo(datos_codigo_descuento).subscribe(
        pr_codigo_promo=>{
        this.pr_alert_toast.dismis_loading();
          let resultado=pr_codigo_promo;
          /* ***************************/
          if(resultado.status==true){
                 let data=resultado.data;
                 this.codigo_generado={
                   id_usuario:'',
                   id_tipo_cupon:0,
                   id_codigo:'',
                   descuento:'',
                 }
                 this.codigo_generado.id_usuario=data.id_usuario;
                 this.codigo_generado.id_codigo=data.id_codigo;
                 this.codigo_generado.id_tipo_cupon=data.id_tipo_cupon;
                 this.codigo_generado.descuento=data.porcentaje_cupon;
                 this.monto_descuento=this.codigo_generado.descuento
                 this.tipo_cupon=this.codigo_generado.id_tipo_cupon;
                 let _descuento;
                 console.log(this.tipo_cupon);
                 if(this.codigo_generado.id_tipo_cupon==1){ /*si es de porcentaje*/
                    localStorage.setItem('descuento_generado',JSON.stringify(this.codigo_generado));
                    _descuento=(parseFloat(this.pago)*parseFloat(this.codigo_generado.descuento))/100;
                    let nuevo_total=parseFloat(this.pago)-_descuento;
                    this.pago=nuevo_total;
                    this.descuento=_descuento;
                    this.descuento_aplicado=1;
                    datos_carrera.monto_real=this.pago;
                 }else{ /*si es por monto*/
                   localStorage.setItem('descuento_generado',JSON.stringify(this.codigo_generado));
                    _descuento=(parseFloat(this.pago)-parseFloat(this.codigo_generado.descuento));
                    let nuevo_total=_descuento;
                    this.pago=nuevo_total;
                    datos_carrera.monto_real=this.pago;
                    this.descuento=this.codigo_generado.descuento; /* anteriormente tenia _descuento*/
                    this.descuento_aplicado=1;
                 }
                 datos_carrera.descuento=_descuento;
                 this.tipo_cupon=this.codigo_generado.id_tipo_cupon;
                 let pag_1=(this.pago*1).toFixed(2);
                 this.pago_codigo_descuento=pag_1;
                 let mensaje='Felicidades tu pago ahora es de: '+pag_1+' avisale al conductor que tienes un código de descuento; indicale el monto que debes pagar';
                 let item=1;
                 this.codigo_descuento_alert(item,mensaje,datos_carrera);
                 this.aplica_codigo_descuento();
               }else{
                 this.data_calificar.codigo_descuento=null;
                 let mensaje=resultado.mensaje;
                 this.pr_alert_toast.show_alert('',mensaje);
               }
          /*****************************/
        },
        err => {console.log('el error '+err);
        },
       );
    }else{
      console.log(datos_carrera);
      let mensaje='Cargando';
     this.pr_alert_toast.show_loading(mensaje);
     this.pr_carrera.guardar_servicio(datos_carrera).subscribe(
      pr_carrera => {
        let resultado=pr_carrera;
        if(resultado.status==true){
          let pedido_automatico=resultado.pedido_automatico;
          if(pedido_automatico==true){
            let data_pedido_automatico=resultado.data_pedido_automatico;
            let crea_cupon_automatico={
              id_usuario: datos_carrera.id_usuario_cliente,
              email:datos_carrera.email,
              porcentaje:'',
              id_tipo_cupon:'',
            }
            for(let value of data_pedido_automatico){
              crea_cupon_automatico.porcentaje=value.porcentaje;
              crea_cupon_automatico.id_tipo_cupon=value.id_tipo_cupon;
            }
            this.crear_cupon_automatico(crea_cupon_automatico);
           }
           this.pr_comentario.guardar_puntaje(puntaje_comentario).subscribe(
            pr_comentario=>{
            this.pr_alert_toast.dismis_loading();
              let resultado=pr_comentario;
              if(resultado.status==true){
                localStorage.removeItem('carrera_creada_pitigo');
                localStorage.removeItem('carrera_aceptada_pitigo');
                localStorage.removeItem('ir_viaje');
                this.navCtrl.setRoot('HomePage');
              }
            },
            err => {console.log('el error '+err);
            },
           );
        }
      },
      err => { 
        let datos_firebase = JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
    console.log(datos_firebase);
    if(datos_firebase.key_firebase){
      firebase.database().ref('carreras_clientes/' + datos_firebase.key_firebase).remove(); /*borra el registro en el firebase*/
    }
    localStorage.removeItem('carrera_creada_pitigo');
    localStorage.removeItem('carrera_aceptada_pitigo');
        this.pr_alert_toast.dismis_loading();
        this.navCtrl.setRoot('HomePage')},
     );
    }
  }
  codigo_descuento_alert(item, item_2, item_3){
    let valor_1=item;
    let mensaje=item_2;
    let dato_carrera=item_3;
    let prompt = this.alertCtrl.create({
        title: '',
        message: mensaje,
        buttons: [
          {
          text: 'Aceptar',
          handler: data =>{
            if(valor_1==1){
              this.confirmar_carrera(dato_carrera);
            }
            this.navCtrl.setRoot('Rate_ridePage');
          }
          }
        ]
      })
      prompt.present();
  }
  crear_cupon_automatico(item){
    let valores=item;
     this.pr_carrera.crear_cupon_automatico_id_usuario(valores).subscribe(
      pr_carrera=>{
        let resultado=pr_carrera;
        if(resultado.status==true){
          let data=resultado.data;
          /*let mensaje=this.translate.instant('cupon_automatico_creado');
          this.pr_alert_toast.mensaje_toast_pie(mensaje);*/
        }
      },
      err => {console.log('el error '+err);
      },
     );
  }
  confirmar_carrera(item){
    let datos_carrera=item;
    let mensaje='Cargando';
    let puntaje_comentario={
      id_usuario:datos_carrera.id_usuario_conductor,
      puntaje:this.data_calificar.puntaje,
      comentario:this.data_calificar.comentario
    }
     this.pr_alert_toast.show_loading(mensaje);
     this.pr_carrera.guardar_servicio(datos_carrera).subscribe(
      pr_carrera=>{
        let resultado=pr_carrera;
        if(resultado.status==true){
           let pedido_automatico=resultado.pedido_automatico;
          if(pedido_automatico==true){
            let data_pedido_automatico=resultado.data_pedido_automatico;
            let crea_cupon_automatico={
              id_usuario: datos_carrera.id_usuario_cliente,
              email:datos_carrera.email,
              porcentaje:'',
              id_tipo_cupon:'',
            }
            for(let value of data_pedido_automatico){
              crea_cupon_automatico.porcentaje=value.porcentaje;
              crea_cupon_automatico.id_tipo_cupon=value.id_tipo_cupon;
            }
            this.crear_cupon_automatico(crea_cupon_automatico);
           }
           this.pr_comentario.guardar_puntaje(puntaje_comentario).subscribe(
            pr_comentario=>{
            this.pr_alert_toast.dismis_loading();
              let resultado=pr_comentario;
              if(resultado.status==true){
                localStorage.removeItem('carrera_creada_pitigo');
                localStorage.removeItem('carrera_aceptada_pitigo');
                localStorage.removeItem('ir_viaje');
                
              }
            },
            err => {console.log('el error '+err);
            },
           );
           
        }
      },
      err => {console.log('el error '+err);
      },
     );
     console.log('adios');
     this.navCtrl.setRoot('HomePage');
  }
  aplica_codigo_descuento(){
     let cambio=0;
     var starCountRef = firebase.database().ref('carreras_clientes');
      let id;
      let query=starCountRef
       /* orderByChild la columna que necesito trabajar*/
       /* equalTo el valor que le está enviando para que lo filtre*/
       .orderByChild('id_carrera')
       .equalTo(this.id_carrera);
        query.on('value', (snap)=>{
        console.log(snap);
         var data=snap.val();
          if(data!=null){
           console.log(data);
           id = Object.keys(data)[0]; /*el key*/
           }
       let datos_carrera_aceptada={
         codigo_descuento:this.pago_codigo_descuento
       }
       console.log(id);
       if(cambio==0){
         cambio=1;
         firebase.database().ref('carreras_clientes/'+id).update(datos_carrera_aceptada); /*actualiza el registro en el firebase*/
       }
    });
  }
  /*************************************************************************************************************/
  estilo_diurno(){
    this.estilo_mapa=[{"featureType": "landscape", "elementType": "all", "stylers": [{"visibility": "on"} ] }, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "poi.business", "elementType": "labels", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "poi.park", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi.school", "elementType": "all", "stylers": [{"visibility": "on"} ] }, {"featureType": "poi.sports_complex", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "transit.station.bus", "elementType": "all", "stylers": [{"visibility": "on"}, {"saturation": "21"}, {"weight": "4.05"} ] }
]
  }
  estilo_nocturno(){
    this.estilo_mapa=[{"featureType": "all", "elementType": "all", "stylers": [{"invert_lightness": true }, {"saturation": "-9"}, {"lightness": "0"}, {"visibility": "simplified"} ] }, {"featureType": "landscape.man_made", "elementType": "all", "stylers": [{"weight": "1.00"} ] }, {"featureType": "road.highway", "elementType": "all", "stylers": [{"weight": "0.49"} ] }, {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "on"}, {"weight": "0.01"}, {"lightness": "-7"}, {"saturation": "-35"} ] }, {"featureType": "road.highway", "elementType": "labels.text", "stylers": [{"visibility": "on"} ] }, {"featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{"visibility": "off"} ] }, {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [{"visibility": "on"} ] } ] 
  } 

}
