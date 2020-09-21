import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { PrCategoriaProvider } from '../../providers/pr-categoria/pr-categoria';
import { PrAlertToastProvider } from '../../providers/pr-alert-toast/pr-alert-toast';
import * as firebase from 'firebase';
declare var google;

@IonicPage()
@Component({
  selector: 'page-locatino_selected',
  templateUrl: 'locatino_selected.html'
})
export class Locatino_selectedPage {
  @ViewChild('mapa') mapElement: ElementRef;
  estilo_mapa: any;
  fecha: any;
  map: any;
  directionsService: any = new google.maps.DirectionsService();
  render = new google.maps.DirectionsRenderer();
  directionsDisplay: any = new google.maps.DirectionsRenderer();
  bounds: any = null;
  myLatLng: any;
  private faqExpand1: boolean;
  private faqExpand2: boolean;
  private fabAction = false;
  metodo_pago_seleccionado: any;
  tipo_pagos: any;
  id_metodo_pago_seleccionado: any = '';
  direccion_inicio: any;
  direccion_fin: any
  datos_calcular_ruta: any;
  id_modo_tarifa: any;
  precio: any;
  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public pr_categoria: PrCategoriaProvider, 
    public pr_alert_toast: PrAlertToastProvider) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let fecha_actual = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + 'Z';
    console.log(fecha_actual);
    this.fecha = fecha_actual;
    let fecha_sola = this.fecha.split('T');
    let fecha_siete = Date.parse(fecha_sola['0'] + ' 19:00');
    let fecha_dia = Date.parse(fecha_sola['0'] + ' 22:00');
    let fecha_actual_2 = Date.parse(fecha_actual);
    if (fecha_actual_2 > fecha_siete) {
      console.log('mayor');
      this.estilo_nocturno();
      console.log(this.estilo_mapa);
    } else {
      this.estilo_diurno();
      console.log('menor');
      console.log(this.estilo_mapa);
    }
    /*verifico el modo de tarifa que voy a cobrar*/
    if (fecha_actual_2 > fecha_dia) {
      this.id_modo_tarifa = 2;
      console.log('mayor');
      console.log(this.estilo_mapa);
    } else {
      this.id_modo_tarifa = 1;
      console.log('menor');
      console.log(this.estilo_mapa);
    }
    /*********************************************/
  }

  ionViewDidLoad() {
    this.get_tipo_pagos();
    this.inicio_fin();
    this.precio_carrera();
    setTimeout(() => {
      this.load_map();
    }, 1000);
  }
  reset() {
    this.faqExpand1 = false;
    this.faqExpand2 = false;
  }
  precio_carrera() {
    this.precio = JSON.parse(localStorage.getItem('precio_carrera'));

  }
  load_map() {
    let lat_long = JSON.parse(localStorage.getItem('lat_long_cliente_pitigo'));
    let lat_long_2 = lat_long.split(',');
    let latLng = new google.maps.LatLng(lat_long_2['0'], lat_long_2['1']);
    let mapEle: HTMLElement = document.getElementById('mapa');
    this.map = new google.maps.Map(mapEle, {
      center: latLng,
      zoom: 18,
      mapTypeControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: this.estilo_mapa
    });
    this.directionsDisplay.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.calcula_ruta();
    });
  }
  faqExpandToggle1() {
    this.reset();
    this.faqExpand1 = !this.faqExpand1;
  }

  faqExpandToggle2() {
    this.reset();
    this.faqExpand2 = !this.faqExpand2;
  }
  toggleFab() {
    this.fabAction = !this.fabAction;
  }
  calcula_ruta() {
    let inicio = JSON.parse(localStorage.getItem('inicio_pitigo'));
    let fin = JSON.parse(localStorage.getItem('fin_pitigo'));
    console.log(fin.lat_lng);
    let el_inicio = inicio['lat_long'].split(',');
    let el_fin = fin.lat_lng.split(',');
    this.directionsService.route({
      origin: new google.maps.LatLng(el_inicio['0'], el_inicio['1']),
      destination: new google.maps.LatLng(el_fin['0'], el_fin['1']),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.datos_calcular_ruta = response;
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }
  inicio_fin() {
    let inicio = JSON.parse(localStorage.getItem('inicio_pitigo'));
    let fin = JSON.parse(localStorage.getItem('fin_pitigo'));
    console.log(fin);
    this.direccion_inicio = inicio['direccion'];
    this.direccion_fin = fin['direccion'];
  }
  get_tipo_pagos() {
    this.pr_categoria.get_tipo_pagos('').subscribe(
      pr_categoria => {
        let resultado = pr_categoria;
        if (resultado.status == true) {
          this.tipo_pagos = resultado.data;
          console.log(this.tipo_pagos);
        }
      },
      err => {
        console.log('el error ' + err);
      },
    );
  }
  seleccionar_metodo_pago() {
    let inputs: any[] = [];
    for (let value of this.tipo_pagos) {
      inputs.push({
        type: 'radio',
        label: value.tipo_pago,
        value: value.id
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Metodo de pago',
      message: 'Seleccione un método de pago',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('OK clicked. Data -> ' + JSON.stringify(data));
            if (data != undefined) {
              this.id_metodo_pago_seleccionado = data;
              for (let value of this.tipo_pagos) {
                if (value.id == data) {
                  this.metodo_pago_seleccionado = value.tipo_pago;
                }
              }
            } else {
              let mensaje = 'Seleccione un método de pago';
              this.pr_alert_toast.mensaje_toast_pie(mensaje);
            }
          }
        }
      ]
    });
    alert.present();
  }
  crear_carrera() {
    let minimo = 1;
    let maximo = 1000;
    let ramdom_id_carrera = Math.random() * (maximo - minimo) + minimo;
    let fecha_sola = this.fecha.split('T');
    let momentoActual = new Date();
    let hora = momentoActual.getHours();
    let minuto = momentoActual.getMinutes();
    let datos_carrera = {
      key_firebase: '',
      desde: this.direccion_inicio,/*listo.*/
      hasta: this.direccion_fin,   /*listo.*/
      distancia: '',               /*listo.*/
      tiempo: '',                  /*listo.*/
      distancia_conductor_cliente: '',
      estatus_carrera: '1',        /*iniciada*/
      fecha: fecha_sola['0'],      /*listo.*/
      hora: hora + ':' + minuto,      /*listo.*/
      id_carrera: ramdom_id_carrera, /*listo.*/
      id_tipo_pago: 1, /*listo.*/
      id_usuario_cliente: '',
      en_proceso:0,
      imagen_cliente: '',
      lat_long_recojo: JSON.parse(localStorage.getItem('lat_long_cliente_pitigo')),
      id_usuario_conductor: '',
      imagen_conductor: '',
      lat_long_fin: '', /*listo.*/
      lat_long_inicio: '',/*listo.*/
      monto: this.precio,
      tipo_pago: 'Efectivo', /*listo.*/
    }
    let data_u = JSON.parse(localStorage.getItem('data_cliente_pitigo'));
    for (let value of data_u) {
      datos_carrera.id_usuario_cliente = value.id;
      if (value.imagen_usuario == null) {
        datos_carrera.imagen_cliente = 'ninguno';
      } else {
        datos_carrera.imagen_cliente = value.imagen_usuario;
      }
    }
    let inicio = JSON.parse(localStorage.getItem('inicio_pitigo'));
    let fin = JSON.parse(localStorage.getItem('fin_pitigo'));
    datos_carrera.lat_long_inicio = inicio['lat_long'];
    datos_carrera.lat_long_fin = fin.lat_lng;
    let legs;
    for (let value of this.datos_calcular_ruta.routes) {
      legs = value.legs;
    }
    for (let value of legs) {
      datos_carrera.distancia = value.distance['text'];
      datos_carrera.tiempo = value.duration['text'];
    }
    console.log(datos_carrera);
    var carreras = firebase.database().ref().child("carreras_clientes");
    carreras.push({
      desde: this.direccion_inicio,                          /*listo.*/
      hasta: this.direccion_fin,                             /*listo.*/
      distancia: datos_carrera.distancia,                    /*listo.*/
      tiempo: datos_carrera.tiempo,                          /*listo.*/
      distancia_conductor_cliente: '',
      estatus_carrera: '1',                                  /*iniciada*/
      fecha: fecha_sola['0'],                                /*listo.*/
      hora: hora + ':' + minuto,                                /*listo.*/
      id_carrera: ramdom_id_carrera,       
      en_proceso:0,                  /*listo.*/
      id_tipo_pago: 1,       /*listo.*/
      id_usuario_cliente: datos_carrera.id_usuario_cliente,
      imagen_cliente: datos_carrera.imagen_cliente,
      id_usuario_conductor: '',
      imagen_conductor: '',
      lat_long_recojo: JSON.parse(localStorage.getItem('lat_long_cliente_pitigo')),
      lat_long_fin: datos_carrera.lat_long_fin,               /*listo.*/
      lat_long_inicio: datos_carrera.lat_long_inicio,        /*listo.*/
      monto: this.precio,
      tipo_pago: 'Efectivo',             /*listo.*/
      aceptado: "0"
    });
    /**************************/
    /*aqui obtiene el key del firebase para borrar la carrera*/
    let id;
    let mensaje = 'Cargando';
    this.pr_alert_toast.show_loading(mensaje);
    var starCountRef = firebase.database().ref('carreras_clientes');
    let query = starCountRef
      /* orderByChild la columna que necesito trabajar*/
      /* equalTo el valor que le está enviando para que lo filtre*/
      .orderByChild('id_carrera')
      .equalTo(ramdom_id_carrera);
    query.on('value', (snap) => {
      console.log(snap);
      this.pr_alert_toast.dismis_loading();
      var data = snap.val();
      if (data != null) {
        console.log(data);
        id = Object.keys(data)[0]; /*el key*/
        datos_carrera.key_firebase = id;
        console.log(datos_carrera);
        localStorage.setItem('carrera_creada_pitigo', JSON.stringify(datos_carrera));
        this.navCtrl.setRoot('Searchin_cabPage');
      }
    });
    /****************************************************************/

  }
  /*************************************************************************************************************/
  estilo_diurno() {
    this.estilo_mapa = [{ "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "poi.business", "elementType": "labels", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "poi.park", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.school", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.station.bus", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "21" }, { "weight": "4.05" }] }
    ]
  }
  estilo_nocturno() {
    this.estilo_mapa = [{ "featureType": "all", "elementType": "all", "stylers": [{ "invert_lightness": true }, { "saturation": "-9" }, { "lightness": "0" }, { "visibility": "simplified" }] }, { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "weight": "1.00" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "weight": "0.49" }] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "weight": "0.01" }, { "lightness": "-7" }, { "saturation": "-35" }] }, { "featureType": "road.highway", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] }]
  }


}
