import { Component,ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavController,AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrRutasProvider} from '../../providers/pr-rutas/pr-rutas';
import {PrEmailEmergenciaProvider} from '../../providers/pr-email-emergencia/pr-email-emergencia';
import SlidingMarker from "marker-animate-unobtrusive";
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
declare var google;
@IonicPage()
@Component({
  selector: 'page-book_ride',
  templateUrl: 'book_ride.html'
})
export class Book_ridePage {
	@ViewChild('mapa') mapElement: ElementRef;
  private fabAction = false;
  cancelar_cliente = false;
	estilo_mapa:any;
	lat_long:any;
	map:any;
	fecha:any;
	mark_array:any[]=[]; /*este es el que guarda la ubicacion de cada uno para que lo muestre en agregar markers ojo*/
  arranque_markers=0;
  taxis_disponibles:any;
  conductor:any={
  	id_usuario:'',
  	nombre:'',
  	imagen:'',
  	telefono:'',
  	tipo_vehiculo:'',
  	marca_vehiculo:'',
  	modelo_vehiculo:'',
  	placa_vehiculo:'',
  	calificacion:'',
  };
  desde:any;
  hasta:any;
  tipo_pago:any;
  ruta_imagenes:any;
  distancia:any;
  tiempo:any;
  carrera:any;
  id_carrera:any;
  on_value_2:any;
  monto:any;
  query_2:any;
  distancia_conductor_cliente:any;
  directionsService: any = new google.maps.DirectionsService();
  directionsDisplay: any = new google.maps.DirectionsRenderer();
  datos_calcular_ruta:any;
  lat_long_inicio:any;
  lat_long_fin:any;
  valor_contacto:any=0;
  driversRef: AngularFireList<any>;
  courseRef: AngularFireList<any>;
  imagen:any=null;
  valor:any=0;
  carrera_estado: 0;
  valor_alerta:any=0;
  habilitar_chat:any=0;
  marker: any;
  constructor(public navCtrl: NavController, 
    public pr_alert_toast:PrAlertToastProvider, 
    public geolocation:Geolocation, public pr_rutas:PrRutasProvider, 
    public alertCtrl:AlertController, public message:SMS, 
    public pr_email_contacto_emergencia:PrEmailEmergenciaProvider, 
    public _domsanitizer:DomSanitizer, public social_sharing:SocialSharing, 
    public llamar:CallNumber,
    public fireDB: AngularFireDatabase) {
  	this.ruta_imagenes=this.pr_rutas.get_ruta_imagenes();
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
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      }).catch((error) => {
        console.log('Error getting location', error);
      });
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
         console.log(data.coords.latitude);
        console.log(data.coords.longitude);
      });
  }

  ionViewDidLoad(){
  	this.loadMap();
  	this.datos_carrera();
  	this.get_carrera_firebase();
    this.los_contactos();
  }

  subscribeToDriversPositions() {
    this.driversRef = this.fireDB.list('taxi_disponible');
    this.driversRef.valueChanges().subscribe((data) => {
      //this.obtener_markers();
      if(!localStorage.getItem('carrera_aceptada_pitigo')){
        return;
      }
      let carrera = JSON.parse(localStorage.getItem('carrera_aceptada_pitigo')).datos_conductor[0];
      let datosCarrera = JSON.parse(localStorage.getItem('carrera_aceptada_pitigo')).datos_carrera[0];
      let idConductor = carrera.id_usuario
      let rawClientPosition = JSON.parse(localStorage.getItem('carrera_creada_pitigo')).lat_long_inicio.split(',');
      let clientInitialPosition = {
        actual_latitud: rawClientPosition[0],
        actual_longitude: rawClientPosition[1]
      };
      let conductor = data.filter(drivers => {
        console.log(drivers.idUser, +idConductor)
        return drivers.idUser == +idConductor;
      })[0];
      console.log(conductor);
      let carrera_estado = datosCarrera.en_proceso;;
      if(carrera_estado == 0)
      {
        console.log('entro recojo');
        this.calulcar_ruta_real_time(conductor, clientInitialPosition);  
      }
      else
      {
        console.log('entro destino');
        let destino = JSON.parse(localStorage.getItem('carrera_aceptada_pitigo')).datos_carrera[0].lat_long_fin.split(',');
        console.log(destino);
        this.calulcar_ruta_real_time(conductor, { actual_latitud:destino[0], actual_longitude:destino[1]});
      }
      let newPosition = new google.maps.LatLng( conductor.actual_latitud, conductor.actual_longitude);
      this.marker.setPosition();
    });
  }

 rate_ride(){
    this.navCtrl.push('Rate_ridePage');
  }  
 toggleFab(){
    this.fabAction = !this.fabAction;
  }
  abrir_chat(){
    this.navCtrl.push('ChatClientePage');
  }
  compartir(){
    let url='https://pittigo.com/ubicacion';
    let mensaje='Mira mi ubicación ingresando el numero de ubicación: '+this.conductor.id_usuario;
    this.social_sharing.share(mensaje,'','', url);
  }
  los_contactos(){
    let _contactos=JSON.parse(localStorage.getItem('contactos_pitigo_clientes'));
    if(_contactos!=null){
      if(_contactos.length>0){
       this.valor_contacto=1;
        // code...
      }
    }else{
     this.valor_contacto=0;
    }
  }
  emergencia(){
    let _contactos=JSON.parse(localStorage.getItem('contactos_pitigo_clientes'));
    let usuario=JSON.parse(localStorage.getItem('data_cliente_pitigo'));
    console.log(_contactos);
    let nombre;
    if(_contactos!=null){
      if(_contactos.length>0){
        this.valor_contacto=1;
       for(let value of usuario){
        nombre=value.fullname;
       }
      let mensaje;
      let datos_enviar={
        nombre:nombre,
        email:'',
      }
      for(let value of _contactos){
        datos_enviar.email=value.email;
        mensaje='El usuario '+nombre+', Tiene una emergencia con nuestro servicio de taxi, por favor contactalo para mas información';
        this.message.send(value.telf, mensaje);
        console.log(datos_enviar);
        this.enviar_email(datos_enviar);
      }
    } 
    }else{
      this.valor_contacto=0;
    }
  }
  enviar_email(item){
   this.pr_email_contacto_emergencia.enviar_email(item).subscribe(
    pr_email_contacto_emergencia=>{
      let resultado=pr_email_contacto_emergencia;
      if(resultado.status==true){
        /*let data=resultado.data;*/
      }
    },
    err => {console.log('el error '+err);
    },
   );
  }
  llamar_conductor(){
    this.llamar.callNumber(this.conductor.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
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
      this.distancia_conductor_cliente=value.distancia_conductor_cliente;
  	 	this.tiempo=value.tiempo;
      this.monto=value.monto;
  	 	this.id_carrera=value.id_carrera;
      this.lat_long_inicio=value.lat_long_inicio;
      this.lat_long_fin=value.lat_long_fin;
  	 }
  }
  confirmar_cancelar_carrera(){
     let cambio=0;
     console.log("cancelar_carreara_accion");
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
         estatus_carrera:5
       }
       console.log(id);
       if(cambio==0){
         cambio=1;
         firebase.database().ref('carreras_clientes/'+id).update(datos_carrera_aceptada); /*actualiza el registro en el firebase*/
         this.navCtrl.setRoot('Rate_ridePage');
       }
    });
  }
  cancelar_carrera(){
    console.log("cancelar_carreara");
    let prompt = this.alertCtrl.create({
        title: 'Advertencia',
        message: 'Estás a punto de cancelar el viaje, ¿Deseas continuar?',
        buttons: [
          {
            text: 'Cancelar',
            handler: data =>{
              console.log('Cancel clicked');
            }
          },
          {
          text: 'Continuar',
          handler: data =>{
            this.cancelar_cliente = true;
            this.confirmar_cancelar_carrera();
          }
          }
        ]
      })
      prompt.present();
  }

  loadMap(){
  
    let datosCarrera = JSON.parse(localStorage.getItem('carrera_aceptada_pitigo')).datos_carrera[0];
    let lat_long=this.lat_long_fin;
    let lat_long_2=datosCarrera.lat_long_fin.split(',');
    let latLng = new google.maps.LatLng(JSON.parse(lat_long_2['0']), JSON.parse(lat_long_2['1']));
    let mapOptions={
      center: latLng,
      zoom: 18,
      mapTypeControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles:this.estilo_mapa,
      
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.directionsDisplay.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.mapElement.nativeElement.classList.add('show-map');
      //this.calcula_ruta();
    });
    this.position_Marker({actual_latitud: lat_long_2[0], actual_longitude: lat_long_2[1]});
    setTimeout(()=>{
     //this.obtener_markers();
     //this.position_Marker();
     this.subscribeToDriversPositions();
     this.subscribeToCarreraStatus();
     },1000);
  }
  position_Marker(driverPosition){
    let customMarker;
    customMarker="assets/imgs/moto_vista_aerea.png";
    console.log('entra en position_marker');
    console.log(this.lat_long_fin);
    this.marker = new SlidingMarker({
     position: driverPosition,
     title: 'el marcador',
     icon: customMarker
   });
   this.marker.setMap(this.map);
   this.marker.setDuration(3000);
   this.marker.setEasing('linear');
 }
  Position_lat_lng(marker, content){
    /*let infoWindow = new google.maps.InfoWindow({
      content: content
    }); */
    google.maps.event.addListener(marker, 'dragend', () =>{
     /* let latitud=marker.getPosition().lat();*/
      /*let longitud=marker.getPosition().lng();*/
      /*infoWindow.open(this.map, marker);*/
    });
  }
  obtener_markers(){
    console.log('entra en obtener markers');
    var starCountRef = firebase.database().ref('taxi_disponible');
    console.log(this.conductor.id_usuario);
    let query=starCountRef
    /* orderByChild la columna que necesito trabajar*/
     /* equalTo el valor que le está enviando para que lo filtre*/
    .orderByChild('id_conductor')
    .equalTo(this.conductor.id_usuario);
    query.on('value', (snap)=>{
      console.log(snap);
      this.taxis_disponibles=[];
       var data=snap.val();
       for(var key in data){
       this.taxis_disponibles.push(data[key]);
       console.log(this.taxis_disponibles);
       this.agregar_marker(this.taxis_disponibles);
       }
    });
  }

  subscribeToCarreraStatus(){
    this.courseRef = this.fireDB.list('carreras_clientes');
    this.courseRef.snapshotChanges().subscribe((data) => {
      let carrera_aceptada_guardada = JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
      if(localStorage.getItem('carrera_creada_pitigo')){
      let id_carrera = carrera_aceptada_guardada.key_firebase;
      let search_carrera = data.filter(course => {
        return course.payload.key == id_carrera;
      });
      console.log(search_carrera);
      if(!search_carrera[0]){
        if(!this.cancelar_cliente) localStorage.removeItem('carrera_aceptada_pitigo');
        return;
      }
      let carrera = search_carrera[0].payload.val();        
      console.log("carrera info");
      console.log(carrera.estatus_carrera);
      if(carrera.estatus_carrera == 5){
        firebase.database().ref('carreras_clientes/'+id_carrera).remove();
        if(!this.cancelar_cliente) localStorage.removeItem('carrera_aceptada_pitigo');
        if(!this.cancelar_cliente) this.navCtrl.setRoot('HomePage');
        return;
      }
      if(carrera_aceptada_guardada != null){
        let carrera_guardada = JSON.parse(localStorage.getItem('carrera_aceptada_pitigo'));
        carrera_guardada.datos_carrera[0] = carrera;
        localStorage.setItem('carrera_aceptada_pitigo',JSON.stringify(carrera_guardada));
        this.carrera_estado = carrera.en_proceso;
      }
    }
    });
  }

  calulcar_ruta_real_time(driver_position, client_position){
    this.directionsService.route({
      origin: new google.maps.LatLng(driver_position.actual_latitud,driver_position.actual_longitude),
      destination: new google.maps.LatLng(client_position.actual_latitud,client_position.actual_longitude),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status)=>{
      if(status === google.maps.DirectionsStatus.OK){
        let legs;
        this.datos_calcular_ruta=response.routes;
         for(let value of this.datos_calcular_ruta){
            legs=value.legs;
         }
         for(let value of legs){
           this.tiempo=value.duration['text'];
           this.distancia=value.distance['text'];
         }
        this.directionsDisplay.setDirections(response);
      }else{
        alert('Could not display directions due to: ' + status);
      }
    });
  }
  agregar_marker(item) {
    let markers = item;
    console.log(markers);
    if (markers) {
      console.log('los monta');
      let customMarker;
      let i = 0;
      let longitud = markers.length;
      for (let marker of markers) {
        customMarker = "assets/imgs/moto_vista_aerea.png";
        console.log(marker);
        let lat_inicio: any = parseFloat(marker.actual_latitud);
        let lng_inicio: any = parseFloat(marker.actual_longitude);
        if (this.arranque_markers == 0) {
          console.log(this.arranque_markers);
          var position = new google.maps.LatLng(lat_inicio, lng_inicio);
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
        } else {
          console.log("entra en actualizar la posicion de los markers");
          var position2 = new google.maps.LatLng(lat_inicio, lng_inicio);
          this.mark_array[i].setPosition(position2);
        }
        i++;
        if (i == longitud) {
          this.arranque_markers = 1;
        }
      }
    }
  }
  get_carrera_firebase(){
     let envio=0;
     let envio_2=0;
     let estatus_carrera;
     console.log(this.id_carrera);
    var starCountRef = firebase.database().ref('carreras_clientes');
    let query= starCountRef
    /* orderByChild la columna que necesito trabajar*/
    /* equalTo el valor que le está enviando para que lo filtre*/
    .orderByChild('id_carrera')
    .equalTo(this.id_carrera);
    this.query_2=starCountRef
     /* orderByChild la columna que necesito trabajar*/
     /* equalTo el valor que le está enviando para que lo filtre*/
    .orderByChild('id_carrera')
    .equalTo(this.id_carrera);
    this.on_value_2=this.query_2.on('value', (snap)=>{
      console.log(snap);
      let carrera=[];
       var data=snap.val();
       for(var key in data){
       carrera.push(data[key]);
       }
       for(let value of carrera){
         estatus_carrera=value.estatus_carrera;
       }
       if(estatus_carrera==3){
        let envio_mensaje=JSON.parse(localStorage.getItem('envio_mensaje_3_pitigo'));
          if(envio_mensaje==null || envio_mensaje==undefined){
            if(envio==0){
              envio=1;
                 let mensaje='El conductor ha llegado';
                 this.pr_alert_toast.show_alert(mensaje,'');
                 this.habilitar_chat=1;
                 localStorage.setItem('envio_mensaje_3_pitigo',JSON.stringify(1));
                 //this.calcula_ruta();
                 /*this.query_2.off('value',this.on_value_2);*/
            }
          }
         }else if(estatus_carrera==6){
          let envio_mensaje_6=JSON.parse(localStorage.getItem('envio_mensaje_6_pitigo'));
          if(envio_mensaje_6==null || envio_mensaje_6==undefined){
           if(envio_2==0){
              envio_2=1;
              localStorage.setItem('envio_mensaje_6_pitigo',JSON.stringify(1));
              this.calificar_carrera();
           }
          }
        }
    });
  }
  calcula_ruta(){
    let inicio=this.lat_long_inicio;
    let fin=this.lat_long_fin;
    console.log(fin);
    let el_inicio=inicio.split(',');
    let el_fin=fin.split(',');
    this.directionsService.route({
      origin: new google.maps.LatLng(el_inicio['0'],el_inicio['1']),
      destination: new google.maps.LatLng(el_fin['0'],el_fin['1']),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status)=>{
      if(status === google.maps.DirectionsStatus.OK){
        let legs;
        console.log(response.routes);
        this.datos_calcular_ruta=response.routes;
         for(let value of this.datos_calcular_ruta){
            legs=value.legs;
         }
         for(let value of legs){
           this.tiempo=value.duration['text'];
           this.distancia=value.distance['text'];
         }
        this.directionsDisplay.setDirections(response);
      }else{
        alert('Could not display directions due to: ' + status);
      }
    });
  }
   calificar_carrera(){
    let prompt = this.alertCtrl.create({
      title: 'Muchas gracias',
      message: 'Esperamos que hayas disfrutado el viaje, para calificarnos haga clic en continuar',
      buttons: [
        {
        text: 'Continuar',
        handler: data =>{
          console.log('Saved clicked');
          this.query_2.off('value',this.on_value_2);
          this.navCtrl.setRoot('Rate_ridePage');
        }
        }
      ]
    })
    prompt.present();
  }
    /*************************************************************************************************************/
  estilo_diurno(){
    this.estilo_mapa=[{"featureType": "landscape", "elementType": "all", "stylers": [{"visibility": "on"} ] }, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "poi.business", "elementType": "labels", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "poi.park", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi.school", "elementType": "all", "stylers": [{"visibility": "on"} ] }, {"featureType": "poi.sports_complex", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "transit.station.bus", "elementType": "all", "stylers": [{"visibility": "on"}, {"saturation": "21"}, {"weight": "4.05"} ] }
	]
  }
  estilo_nocturno(){
    this.estilo_mapa=[{"featureType": "all", "elementType": "all", "stylers": [{"invert_lightness": true }, {"saturation": "-9"}, {"lightness": "0"}, {"visibility": "simplified"} ] }, {"featureType": "landscape.man_made", "elementType": "all", "stylers": [{"weight": "1.00"} ] }, {"featureType": "road.highway", "elementType": "all", "stylers": [{"weight": "0.49"} ] }, {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "on"}, {"weight": "0.01"}, {"lightness": "-7"}, {"saturation": "-35"} ] }, {"featureType": "road.highway", "elementType": "labels.text", "stylers": [{"visibility": "on"} ] }, {"featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{"visibility": "off"} ] }, {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [{"visibility": "on"} ] } ] 
  }

  ionViewDidLeave(){
    this.driversRef = null;
    this.courseRef = null;
  }
}
