import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Events, AlertController, MenuController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PrAlertToastProvider } from '../../providers/pr-alert-toast/pr-alert-toast';
import { PrTarifaProvider } from '../../providers/pr-tarifa/pr-tarifa';
import { Geolocation } from '@ionic-native/geolocation';
import SlidingMarker from "marker-animate-unobtrusive";
import { Geocoder } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import * as firebase from 'firebase';
import { UserInfo } from '../../models/user-info.model';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { c } from '@angular/core/src/render3';

var firebaseConfig = {
  apiKey: "AIzaSyBcbnpyh27faTeEkxB27Wrw6BZD3HLJueQ",
  authDomain: "remises-ya-48c63.firebaseapp.com",
  databaseURL: "https://remises-ya-48c63.firebaseio.com",
  projectId: "remises-ya-48c63",
  storageBucket: "remises-ya-48c63.appspot.com",
  messagingSenderId: "569111837089",
  appId: "1:569111837089:web:27c422275f41443a7b33e0"
};
declare var google;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('mapa') mapElement: ElementRef;
  estilo_mapa: any;
  fecha: any;
  map: any;
  driversRef: AngularFireList<any>;
  id_tipo_tarifa: any;
  precio_tarifa: any;
  taxis_disponibles: any[] = [];
  mark_array: any[] = []; /*este es el que guarda la ubicacion de cada uno para que lo muestre en agregar markers ojo*/
  arranque_markers = 0;
  lat_long: any;
  calle: any;
  latitud: any;
  longitud: any;
  drivers: Observable<any>;
  en_linea_conductor: any;
  id_modo_tarifa: any;
  data_user = new UserInfo();
  el_mapa: any = 0;
  constructor(public navCtrl: NavController,
    public translate: TranslateService,
    public pr_alert_toast: PrAlertToastProvider,
    public geolocation: Geolocation,
    public pr_tarifa: PrTarifaProvider,
    public nativeGeocoder: NativeGeocoder,
    public geocoder: Geocoder, public events: Events,
    public alertCtrl: AlertController,
    public diagnostic: Diagnostic,
    public menu: MenuController,
    public fireDB: AngularFireDatabase) {

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }


    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let fecha_actual = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + 'Z';
    this.fecha = fecha_actual;
    let fecha_sola = this.fecha.split('T');
    let fecha_siete = Date.parse(fecha_sola['0'] + ' 19:00');
    let fecha_dia = Date.parse(fecha_sola['0'] + ' 22:00');

    this.data_user = JSON.parse(localStorage.getItem('data_cliente_pitigo'))[0];
    let fecha_actual_2 = Date.parse(fecha_actual);
    if (fecha_actual_2 > fecha_siete) {
      this.id_tipo_tarifa = 1;
      this.estilo_diurno();
    } else {
      this.id_tipo_tarifa = 2;
      this.estilo_nocturno();
    }
    if (fecha_actual_2 > fecha_dia) {
      this.id_modo_tarifa = 2;
    } else {
      this.id_modo_tarifa = 1;
    }
    localStorage.setItem('modo_tarifa_pitigo', JSON.stringify(this.id_modo_tarifa));


  }

  subscribeToLocationChange() {
    this.geolocation.getCurrentPosition().then((resp) => {
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.saveLocation(data.coords.longitude, data.coords.latitude, this.data_user.id);
    });
  }
  search() {
    this.navCtrl.setRoot('SearchPage');
  }

  subscribeToDriversPositions() {
    this.driversRef = this.fireDB.list('taxi_disponible');
    this.driversRef.valueChanges().subscribe((data) => {
      this.obtener_markers();
    });
  }

  ionViewDidLoad() {
    this.veirificar_gps();
    this.get_tarifa();
    this.usuario();
    this.menu.enable(true, 'el_menu');
    setTimeout(() => {
      this.carrera_aceptada_creada();
    }, 3000);
  }
  veirificar_gps() {
    this.diagnostic.isGpsLocationEnabled()
      .then((state) => {
        /* this.diagnostic.switchToLocationSettings()*/
        if (state == false) {
          let prompt = this.alertCtrl.create({
            title: 'Información',
            message: 'Para poder utilizar nuestra app debes activar el GPS',
            buttons: [
              {
                text: 'OK',
                handler: data => {
                  this.ubicacion_cliente();
                }
              }
            ]
          })
          prompt.present();
        } else {
          this.ubicacion_cliente();
        }
      }).catch(e => {
        console.error(e);
        this.ubicacion_cliente();
      });
  }

  saveLocation(long, lat, idUser) {
    console.log('enter Save Location');
    firebase.database().ref().child("position_client/" + idUser.toString()).set({
      idUser: idUser,
      actual_longitude: long,
      actual_latitud: lat
    });

  }
  carrera_aceptada_creada() {
    let carrera_aceptada = JSON.parse(localStorage.getItem('carrera_aceptada_pitigo'));
    let carrera_creada = JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
    let valor_aceptada = 0;
    let valor_creado = 0;
    if (carrera_aceptada != null || carrera_aceptada != undefined) {
      valor_aceptada = 1;
    }
    if (carrera_creada != undefined || carrera_creada != null) {
      valor_creado = 1;
    }
    if (valor_creado == 1 && valor_aceptada == 1) {
      let prompt = this.alertCtrl.create({
        title: 'Advertencia',
        message: 'Tienes un viaje aceptado por un conductor ¿Que deseas hacer?',
        buttons: [
          {
            text: 'Borrar viaje',
            handler: data => {
              this.cancelar_carrera_firebase_2();
            }
          },
          {
            text: 'Ir a viaje',
            handler: data => {
              this.navCtrl.setRoot('Book_ridePage');
            }
          }
        ]
      })
      prompt.present();
    } else if (valor_creado == 0 && valor_aceptada == 1) {
      let prompt = this.alertCtrl.create({
        title: 'Advertencia',
        message: 'Tienes un viaje aceptado por un conductor ¿Que deseas hacer?',
        buttons: [
          {
            text: 'Borrar viaje',
            handler: data => {
              this.cancelar_carrera_firebase_2();
            }
          },
          {
            text: 'Ir a viaje',
            handler: data => {
              this.navCtrl.setRoot('Book_ridePage');
            }
          }
        ]
      })
      prompt.present();
    } else if (valor_creado == 1 && valor_aceptada == 0) {
      let prompt = this.alertCtrl.create({
        title: 'Advertencia',
        message: 'Tienes un viaje creado ¿Que deseas hacer?',
        buttons: [
          {
            text: 'Borrar viaje',
            handler: data => {
              this.cancelar_carrera_firebase();
            }
          },
          {
            text: 'Ir a viaje',
            handler: data => {
              localStorage.setItem('ir_viaje', JSON.stringify(1));
              this.navCtrl.setRoot('Searchin_cabPage');
            }
          }
        ]
      })
      prompt.present();
    }
  }
  cancelar_carrera_firebase() {
    let datos_firebase = JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
    console.log(datos_firebase);
    firebase.database().ref('carreras_clientes/' + datos_firebase.key_firebase).remove(); /*borra el registro en el firebase*/
    localStorage.removeItem('carrera_creada_pitigo');
  }
  cancelar_carrera_firebase_2() {
    let datos_firebase = JSON.parse(localStorage.getItem('carrera_creada_pitigo'));
    console.log(datos_firebase);
    firebase.database().ref('carreras_clientes/' + datos_firebase.key_firebase).remove(); /*borra el registro en el firebase*/
    localStorage.removeItem('carrera_creada_pitigo');
    localStorage.removeItem('carrera_aceptada_pitigo');
  }

  usuario() {
    let item = 1;
    this.events.publish('usuario', item);
  }
  get_tarifa() {
    this.pr_tarifa.get_tarifa('').subscribe(
      pr_tarifa => {
        let resultado = pr_tarifa;
        if (resultado.status == true) {
          let data = resultado.data;
          for (let value of data) {
            if (this.id_tipo_tarifa == value.id_tipo_tarifa) {
              this.precio_tarifa = value.precio;
            }
          }
        }
      },
      err => {
        console.log('el error ' + err);
      },
    );
  }
  loadMap() {
    let lat_long = JSON.parse(localStorage.getItem('lat_long_cliente_pitigo'));
    let lat_long_2 = lat_long.split(',');
    let lat = parseFloat(this.latitud);
    let long = parseFloat(this.longitud);
    let latLng = new google.maps.LatLng(lat, long);
    this.lat_long = latLng;
    console.log(latLng);
    console.log(this.lat_long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    console.log(mapOptions);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    setTimeout(() => {
      this.position_Marker();
      this.subscribeToLocationChange();
      this.subscribeToDriversPositions();
    }, 1000);
  }
  position_Marker() {
    console.log('entra en position_marker');
    console.log(this.lat_long);
    let marker = new google.maps.Marker({
      map: this.map,
      /* animation: google.maps.Animation.DROP,*/
      position: this.lat_long,
      draggable: true,
    });
    let content = "<h4>Usted está aqui</h4>";
    this.Position_lat_lng(marker, content);
  }
  Position_lat_lng(marker, content) {
    /*let infoWindow = new google.maps.InfoWindow({
      content: content
    }); */
    google.maps.event.addListener(marker, 'dragend', () => {
      let latitud = marker.getPosition().lat();
      let longitud = marker.getPosition().lng();
      this.localizacion_inversa(latitud, longitud);
      /*infoWindow.open(this.map, marker);*/
    });
  }
  localizacion_inversa(lat_i, lng_i) {
    let latitud = lat_i;
    let longitud = lng_i;
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitud, longitud, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        console.log(result[0]);
        this.calle = result[0].thoroughfare + ',' + result[0].subThoroughfare + ',' + result[0].subLocality + ',' + result[0].postalCode;
        console.log(JSON.stringify(result[0]));
        console.log(this.calle);
        let loc_inicio = {
          lat_long: latitud + ',' + longitud,
          direccion: this.calle
        }
        localStorage.setItem('inicio_pitigo', JSON.stringify(loc_inicio));
      }
      )
      .catch((error: any) => {
        this.calle = 'La calle';
        let loc_inicio = {
          lat_long: latitud + ',' + longitud,
          direccion: this.calle
        }
        console.log(loc_inicio);
        localStorage.setItem('inicio_pitigo', JSON.stringify(loc_inicio));
      });
  }
  obtener_markers() {
    console.log('entra en obtener markers');
    var starCountRef = firebase.database().ref('taxi_disponible');
    let query = starCountRef
    query.on('value', (snap) => {
      this.taxis_disponibles = [];
      var data = snap.val();
      for (var key in data) {
        this.taxis_disponibles.push(data[key]);
      }
      this.agregar_marker(this.taxis_disponibles);
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
  ubicacion_cliente() {
    let options = { maximumAge: 500, timeout: 1000, enableHighAccuracy: false };
    this.lat_long = null;
    this.latitud = null;
    this.longitud = null;

    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.lat_long = resp.coords.latitude + ',' + resp.coords.longitude;
      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
      localStorage.removeItem('lat_long_cliente_pitigo');
      this.el_mapa = 1;
      localStorage.setItem('lat_long_cliente_pitigo', JSON.stringify(this.lat_long));
      this.localizacion_inversa(this.latitud, this.longitud);
      setTimeout(() => {

        this.loadMap();
      }, 3000);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  /*************************************************************************************************************/
  estilo_diurno() {
    this.estilo_mapa = [{ "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "poi.business", "elementType": "labels", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "poi.park", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.school", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.station.bus", "elementType": "all", "stylers": [{ "visibility": "on" }, { "saturation": "21" }, { "weight": "4.05" }] }
    ]
  }
  estilo_nocturno() {
    this.estilo_mapa = [{ "featureType": "all", "elementType": "all", "stylers": [{ "invert_lightness": true }, { "saturation": "-9" }, { "lightness": "0" }, { "visibility": "simplified" }] }, { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "weight": "1.00" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "weight": "0.49" }] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "weight": "0.01" }, { "lightness": "-7" }, { "saturation": "-35" }] }, { "featureType": "road.highway", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] }]
  }

  ionViewDidLeave() {
    this.driversRef = null;
  }

}
