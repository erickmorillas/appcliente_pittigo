import { Component, ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavController,AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrLoginProvider} from '../../providers/pr-login/pr-login';
import SlidingMarker from "marker-animate-unobtrusive";
declare var google;
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-searchin_cab',
  templateUrl: 'searchin_cab.html'
})
export class Searchin_cabPage {
	@ViewChild('mapa') mapElement: ElementRef;
  placesService:any;
  la_calle:any;
  mark_array:any[]=[];
  taxis_disponibles:any[]=[];
  arranque_markers:any=0;
	map: any;
	service = new google.maps.places.AutocompleteService();
  directionsService: any = new google.maps.DirectionsService();
  render = new google.maps.DirectionsRenderer();
  directionsDisplay: any = new google.maps.DirectionsRenderer();
  bounds: any = null;
  myLatLng: any;
	lat_long:any;
	latitud:any;
	longitud:any;
	estilo_mapa:any;
	fecha:any;
	datos_calcular_ruta:any;
	/*la parte de firebase*/
	query_1:any;
  query_2:any;
  value_2:any;
  value_1:any;
  on_value_1:any;
  g_starCountRef_1:any;
  query:any;
  g_starCountRef:any;
  carrera:any[]=[];
	/**********************/
  constructor(public navCtrl: NavController, public pr_alert_toast:PrAlertToastProvider, public geolocation:Geolocation, public pr_login:PrLoginProvider, public alertCtrl:AlertController){
  	 var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let fecha_actual=(new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + 'Z';
    console.log(fecha_actual);
    this.fecha=fecha_actual;
    let fecha_sola=this.fecha.split('T');
    let fecha_siete=Date.parse(fecha_sola['0']+' 19:00');
    let fecha_actual_2=Date.parse(fecha_actual);
    if(fecha_actual_2>fecha_siete){
      console.log('mayor');
      this.estilo_nocturno();
      console.log(this.estilo_mapa);
    }else{
      this.estilo_diurno();
      console.log('menor');
      console.log(this.estilo_mapa);
    }

  }
  ionViewDidLoad(){
  	this.ubicacion_cliente();
    let ir_viaje=JSON.parse(localStorage.getItem('ir_viaje'));
    if(ir_viaje==1){
  	  this.get_carrera_firebase_2();
    }else{
      this.get_carrera_firebase();

    }
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
   cancelar_carrera(){
    let alertCtrl=this.alertCtrl.create({
      title: 'Advertencia',
      message: "Se borraran los datos del viaje ¿Desea continuar?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
           this.cancelar_carrera_firebase();
          }
        }
      ]
  });
    alertCtrl.present();
  }
   cancelar_carrera_firebase(){
    let datos_firebase=JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
    console.log(datos_firebase);
    firebase.database().ref('carreras_clientes/'+datos_firebase.key_firebase).remove(); /*borra el registro en el firebase*/
    localStorage.removeItem('carrera_creada_pitigo');
    this.query.off('value',this.on_value_1);
    this.navCtrl.setRoot('HomePage');
  }
  loadMap(){
    let latLng = new google.maps.LatLng(this.latitud,this.longitud);
    this.lat_long=latLng;
    console.log(this.lat_long);
    let mapEle: HTMLElement = document.getElementById('mapa');
   this.map = new google.maps.Map(mapEle,{
      center: latLng,
      zoom: 18,
      mapTypeControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles:this.estilo_mapa
    });
    this.directionsDisplay.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
    mapEle.classList.add('show-map');
    this.calcula_ruta();
    });
    this.calcula_ruta();
    setTimeout(()=>{
     this.obtener_markers();
    /* this.Position_Marker();*/
     },1000);
  }
  obtener_markers(){
    console.log('entra en obtener markers');
    var starCountRef = firebase.database().ref('taxi_disponible');
    let query=starCountRef
    query.on('value', (snap)=>{
      console.log(snap);
      this.taxis_disponibles=[];
       var data=snap.val();
       for(var key in data){
       this.taxis_disponibles.push(data[key]);
       console.log(this.taxis_disponibles);
       }
       this.agregar_marker(this.taxis_disponibles);
    });
  }
  agregar_marker(item){
     let markers=item;
     console.log(markers);
     if(markers) {
       console.log('los monta');
      let customMarker;
      let i=0;
      let longitud=markers.length;
       for(let marker of markers){
        customMarker="assets/imgs/moto_vista_aerea.png";
           console.log(marker.lat_long);
           let lat_inicio: any = parseFloat(marker.actual_latitud);
           let lng_inicio: any = parseFloat(marker.actual_longitude);
            if(this.arranque_markers==0){
              console.log(this.arranque_markers);
             var position = new google.maps.LatLng(lat_inicio,lng_inicio);
              this.mark_array[i] = new SlidingMarker({
              position: position,
              title: 'el marcador',
              icon: customMarker
            });
              /*lo coloco fuera porque asi lo llama directo por cada marker*/
              this.mark_array[i].setMap(this.map);
              this.mark_array[i].setDuration(3000);
              this.mark_array[i].setEasing('linear');
              console.log("entra en colocar los markers");
            }else{
              console.log("entra en actualizar la posicion de los markers");
              var position2 = new google.maps.LatLng(lat_inicio,lng_inicio);
              this.mark_array[i].setPosition(position2);
            }
           i++;
           if(i==longitud){
              this.arranque_markers=1;
           }
          }
    }
  }
  calcula_ruta(){
    let inicio=JSON.parse(localStorage.getItem('inicio_pitigo'));
    let fin=JSON.parse(localStorage.getItem('fin_pitigo'));
    console.log(fin.lat_lng);
    let el_inicio=inicio['lat_long'].split(',');
    let el_fin=fin.lat_lng.split(',');
    this.directionsService.route({
      origin: new google.maps.LatLng(el_inicio['0'],el_inicio['1']),
      destination: new google.maps.LatLng(el_fin['0'],el_fin['1']),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status)=>{
      if(status === google.maps.DirectionsStatus.OK){
        console.log(response);
        this.datos_calcular_ruta=response;
        this.directionsDisplay.setDirections(response);
      }else{
        alert('Could not display directions due to: ' + status);
      }
    });
  }
  get_carrera_firebase_2(){
   let datos_firebase=JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
     console.log(datos_firebase);
   let aceptado;
   let id_conductor;
   let on_value;
    this.g_starCountRef = firebase.database().ref('carreras_clientes');
    this.query=this.g_starCountRef
     /* orderByChild la columna que necesito trabajar*/
     /* equalTo el valor que le está enviando para que lo filtre*/
    .orderByChild('id_carrera')
    .equalTo(datos_firebase.id_carrera);
    this.on_value_1=this.query.on('value', (snap)=>{
      console.log(snap);
       var data=snap.val();
       for(var key in data){
       this.carrera=[];
       this.carrera.push(data[key]);
       console.log(this.carrera);
        for(let value of this.carrera){
          aceptado=value.aceptado;
          id_conductor=value.id_usuario_conductor
        }
       }
      if(aceptado=='1' || aceptado==1){
       console.log(aceptado);
       this.query.off('value',on_value);
       this.buscar_conductor(id_conductor);  
      }
    });
  }
  get_carrera_firebase(){
   let datos_firebase=JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
     console.log(datos_firebase);
   let aceptado;
   let id_conductor;
   let on_value;
    this.g_starCountRef = firebase.database().ref('carreras_clientes');
    this.query=this.g_starCountRef
     /* orderByChild la columna que necesito trabajar*/
     /* equalTo el valor que le está enviando para que lo filtre*/
    .orderByChild('id_carrera')
    .equalTo(datos_firebase.id_carrera);
    this.on_value_1=this.query.on('value', (snap)=>{
      console.log(snap);
       var data=snap.val();
       for(var key in data){
       this.carrera=[];
       this.carrera.push(data[key]);
       console.log(this.carrera);
        for(let value of this.carrera){
          aceptado=value.aceptado;
          id_conductor=value.id_usuario_conductor
        }
       }
    });
    if(aceptado=='1'){
     console.log(aceptado);
     this.query.off('value',on_value);
     this.buscar_conductor(id_conductor);  
    }
  }
  buscar_conductor(item){
    let datos={
      id_usuario:item,
    }
     this.pr_login.get_usuario_taxista_id_usuario(datos).subscribe(
      pr_login=>{
       let resultado=pr_login;
       if(resultado.status==true){
        let data=resultado.data;
        let datos_storage={
          datos_carrera:this.carrera,
          datos_conductor:data
        }
        console.log(datos_storage);
        localStorage.setItem('carrera_aceptada_pitigo',JSON.stringify(datos_storage));
        this.navCtrl.setRoot('Book_ridePage');
       }
      },
      err => {console.log('el error '+err);
      },
     );
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
