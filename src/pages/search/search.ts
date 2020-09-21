import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { PrAlertToastProvider } from '../../providers/pr-alert-toast/pr-alert-toast';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { PrZonaProvider } from '../../providers/pr-zona/pr-zona';
import { PrTarifaProvider } from '../../providers/pr-tarifa/pr-tarifa';
import SlidingMarker from "marker-animate-unobtrusive";
declare var google;
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  @ViewChild('mapa') mapElement: ElementRef;
  estilo_mapa: any;
  fecha: any;
  map: any;
  autocomplete;
  ubicaciones_frecuentes_todas: any[] = [];
  autocompleteItems;
  service = new google.maps.places.AutocompleteService();
  placesService: any;
  la_calle: any;
  mark_array: any[] = [];
  taxis_disponibles: any[] = [];
  arranque_markers: any = 0;
  latitud: any;
  longitud: any;
  lat_long: any;
  det_zona_lat_long: any;
  zona_1: any[] = [];
  zona_2: any[] = [];
  zona_3: any[] = [];
  zona_4: any[] = [];
  zona_5: any[] = [];
  zona_6: any[] = [];
  zona_7: any[] = [];
  zona_8: any[] = [];
  zona_9: any[] = [];
  zona_10: any[] = [];
  id_zona: any;
  id_zona_inicio: any;
  id_modo_tarifa: any;
  precio: any;
  hora_minuto: any;
  constructor(public navCtrl: NavController, public translate: TranslateService, public pr_alert_toast: PrAlertToastProvider, public geolocation: Geolocation, public zone: NgZone, public pr_zona: PrZonaProvider, public pr_tarifa: PrTarifaProvider) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    }
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let fecha_actual = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + 'Z';
    this.fecha = fecha_actual;
    let fecha_sola = this.fecha.split('T');
    let fecha_diez = Date.parse(fecha_sola['0'] + '22:00');
    let hora_diez = '22:00';
    let fecha_actual_2 = Date.parse(fecha_actual);
    if (fecha_actual_2 > fecha_diez) {
      //console.log('mayor');
      this.estilo_nocturno();
      //console.log(this.estilo_mapa);
    } else {
      //console.log('menor');
      this.estilo_diurno();
      //console.log(this.estilo_mapa);
    }
    /*********************************************/
    let horaActual = new Date();
    let hora = horaActual.getHours();
    let minuto = horaActual.getMinutes();
    this.hora_minuto = hora + ':' + minuto;
    //console.log(this.hora_minuto);
    if (this.hora_minuto > hora_diez) {
      //console.log('hora es mayor');
      this.id_modo_tarifa = 2;
      localStorage.setItem('modo_tarifa_pitigo', JSON.stringify(this.id_modo_tarifa));
    } else {
      //console.log('hora es menor');
      this.id_modo_tarifa = 1;
      localStorage.setItem('modo_tarifa_pitigo', JSON.stringify(this.id_modo_tarifa));
    }
  }
  ionViewDidLoad() {
    this.loadMap();
    this.get_zonas();
  }
  locatino_selected() {
    this.navCtrl.setRoot('Locatino_selectedPage');
  }
  get_tarifa() {
    let mensaje = 'Cargando';
    this.pr_alert_toast.show_loading(mensaje);
    this.pr_tarifa.get_tarifa('').subscribe(
      pr_tarifa => {
        this.pr_alert_toast.dismis_loading();
        let resultado = pr_tarifa;
        if (resultado.status == true) {
          let data = resultado.data;
          for (let value of data) {
            if (this.id_zona_inicio == 1) { /* toma el precio de la zona fin para ir al destino*/
              if (this.id_zona == value.id_zona && this.id_modo_tarifa == value.id_modo_tarifa) {
                //console.log(value.id_zona);
                this.precio = value.precio;
              }
            } else {
              /* toma el precio de la zona inicio para ir al destino */
              if (this.id_zona_inicio == value.id_zona && this.id_modo_tarifa == value.id_modo_tarifa) {
                //console.log(value.id_zona);
                this.precio = value.precio;
              }
            }
          }
          if (this.precio == undefined) {
            let mensaje = 'No contamos con información en esa zona';
            this.pr_alert_toast.show_alert('', mensaje);
          } else {
            localStorage.setItem('precio_carrera', JSON.stringify(this.precio));
            this.navCtrl.setRoot('Locatino_selectedPage');
          }

        }
      },
      err => {
        console.log('el error ' + err);
      },
    );
  }

  atras() {
    this.navCtrl.setRoot('HomePage');
  }
  get_zonas() {
    let mensaje = 'Cargando';
    this.pr_alert_toast.show_loading(mensaje);
    this.pr_zona.get_zona_lat_long('').subscribe(
      pr_zona => {
        this.pr_alert_toast.dismis_loading();
        let resultado = pr_zona;
        if (resultado.status == true) {
          let data = resultado.data;
          this.det_zona_lat_long = data;
          for (let value of data) {
            if (value.id_zona == 1) {
              this.zona_1.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 2) {
              this.zona_2.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 3) {
              this.zona_3.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 4) {
              this.zona_4.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 5) {
              this.zona_5.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 6) {
              this.zona_6.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 7) {
              this.zona_7.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 8) {
              this.zona_8.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 9) {
              this.zona_9.push({
                lat: value.lat,
                long: value.long
              })
            } else if (value.id_zona == 10) {
              this.zona_10.push({
                lat: value.lat,
                long: value.long
              })
            }
          }
          this.locacion_inicio();
        }
      },
      err => {
        console.log('el error ' + err);
      },
    );
  }
  locacion_inicio() {
    let direccion = JSON.parse(localStorage.getItem('inicio_pitigo'));
    this.la_calle = direccion['direccion'];
    let lat_long = direccion['lat_long'];
    console.log(lat_long);
    this.poligono_inicio(lat_long);
  }
  loadMap() {
    let lat_long = JSON.parse(localStorage.getItem('lat_long_cliente_pitigo'));
    let lat_long_2 = lat_long.split(',');
    let lat = parseFloat(lat_long_2['0']);
    let long = parseFloat(lat_long_2['1']);
    let latLng = new google.maps.LatLng(lat, long);
    this.lat_long = latLng;
    console.log(this.lat_long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    setTimeout(() => {
      this.obtener_markers();
      /* this.Position_Marker();*/
    }, 1000);
  }
  poligono_inicio(item) {
    let fin = item;
    let lat_long_2 = fin.split(',');
    let latLng = new google.maps.LatLng(lat_long_2['0'], lat_long_2['1']);
    let zona_11: any[] = [];
    let zona_21: any[] = [];
    let zona_31: any[] = [];
    let zona_41: any[] = [];
    let zona_51: any[] = [];
    let zona_61: any[] = [];
    let zona_71: any[] = [];
    let zona_81: any[] = [];
    let zona_91: any[] = [];
    let zona_101: any[] = [];
    for (let value of this.zona_1) {
      zona_11.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_2) {
      zona_21.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_3) {
      zona_31.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_4) {
      zona_41.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_5) {
      zona_51.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_6) {
      zona_61.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_7) {
      zona_71.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_8) {
      zona_81.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_9) {
      zona_91.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_10) {
      zona_101.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    let zona_1 = new google.maps.Polygon({
      paths: zona_11
    });
    let zona_2 = new google.maps.Polygon({
      paths: zona_21
    });
    let zona_3 = new google.maps.Polygon({
      paths: zona_31
    });
    let zona_4 = new google.maps.Polygon({
      paths: zona_41
    });
    let zona_5 = new google.maps.Polygon({
      paths: zona_51
    });
    let zona_6 = new google.maps.Polygon({
      paths: zona_61
    });
    let zona_7 = new google.maps.Polygon({
      paths: zona_71
    });
    let zona_8 = new google.maps.Polygon({
      paths: zona_81
    });
    let zona_9 = new google.maps.Polygon({
      paths: zona_91
    });
    let zona_10 = new google.maps.Polygon({
      paths: zona_101
    });
    console.log(zona_1);

    if (google.maps.geometry.poly.containsLocation(latLng, zona_1) == true) {
      this.id_zona_inicio = 1;
    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_2) == true) {
      this.id_zona_inicio = 2;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_3) == true) {
      this.id_zona_inicio = 3;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_4) == true) {
      this.id_zona_inicio = 4;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_5) == true) {
      this.id_zona_inicio = 5;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_6) == true) {
      this.id_zona_inicio = 6;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_7) == true) {
      this.id_zona_inicio = 7;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_8) == true) {
      this.id_zona_inicio = 8;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_9) == true) {
      this.id_zona_inicio = 9;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_10) == true) {
      this.id_zona_inicio = 10;
    } else {
      this.id_zona_inicio = 5;
    }
    console.log(this.id_zona_inicio);
  }
  poligono_fin(item) {
    let fin = item;
    let lat_long_2 = fin.lat_lng.split(',');
    let latLng = new google.maps.LatLng(lat_long_2['0'], lat_long_2['1']);
    let zona_11: any[] = [];
    let zona_21: any[] = [];
    let zona_31: any[] = [];
    let zona_41: any[] = [];
    let zona_51: any[] = [];
    let zona_61: any[] = [];
    let zona_71: any[] = [];
    let zona_81: any[] = [];
    let zona_91: any[] = [];
    let zona_101: any[] = [];
    for (let value of this.zona_1) {
      zona_11.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_2) {
      zona_21.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_3) {
      zona_31.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_4) {
      zona_41.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_5) {
      zona_51.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_6) {
      zona_61.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_7) {
      zona_71.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_8) {
      zona_81.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_9) {
      zona_91.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    for (let value of this.zona_10) {
      zona_101.push(
        new google.maps.LatLng(value.lat, value.long)
      )
    }
    let zona_1 = new google.maps.Polygon({
      paths: zona_11
    });
    let zona_2 = new google.maps.Polygon({
      paths: zona_21
    });
    let zona_3 = new google.maps.Polygon({
      paths: zona_31
    });
    let zona_4 = new google.maps.Polygon({
      paths: zona_41
    });
    let zona_5 = new google.maps.Polygon({
      paths: zona_51
    });
    let zona_6 = new google.maps.Polygon({
      paths: zona_61
    });
    let zona_7 = new google.maps.Polygon({
      paths: zona_71
    });
    let zona_8 = new google.maps.Polygon({
      paths: zona_81
    });
    let zona_9 = new google.maps.Polygon({
      paths: zona_91
    });
    let zona_10 = new google.maps.Polygon({
      paths: zona_101
    });
    console.log(zona_1);

    if (google.maps.geometry.poly.containsLocation(latLng, zona_1) == true) {
      this.id_zona = 1;
    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_2) == true) {
      this.id_zona = 2;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_3) == true) {
      this.id_zona = 3;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_4) == true) {
      this.id_zona = 4;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_5) == true) {
      this.id_zona = 5;
    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_6) == true) {
      this.id_zona = 6;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_7) == true) {
      this.id_zona = 7;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_8) == true) {
      this.id_zona = 8;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_9) == true) {
      this.id_zona = 9;

    } else if (google.maps.geometry.poly.containsLocation(latLng, zona_10) == true) {
      this.id_zona = 10;
    } else {

    }
    console.log(this.id_zona);
    this.get_tarifa();
  }
  obtener_markers() {
    console.log('entra en obtener markers');
    var starCountRef = firebase.database().ref('taxi_disponible');
    let query = starCountRef
    query.on('value', (snap) => {
      console.log(snap);
      this.taxis_disponibles = [];
      var data = snap.val();
      for (var key in data) {
        this.taxis_disponibles.push(data[key]);
        console.log(this.taxis_disponibles);
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
        console.log(marker.lat_long);
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
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat_long = resp.coords.latitude + ',' + resp.coords.longitude;
      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
      localStorage.setItem('lat_long_cliente_pitigo', JSON.stringify(this.lat_long));
      setTimeout(() => {
        this.loadMap();
      }, 1000);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  updateSearch() {
    console.log('modal > updateSearch');
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let self = this;
    let config = {
      /*  types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'*/
      input: 'Barranca ' + this.autocomplete.query,  /*si quiero buscar por lugar exacto  input: 'lugar'+this.autocomplete.query,*/
      componentRestrictions: { country: 'PE' }
    }
    this.service.getPlacePredictions(config, function (predictions, status) {
      console.log('modal > getPlacePredictions > status > ', status);
      self.autocompleteItems = [];
      self.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            self.autocompleteItems.push(prediction);
          });
        }
      });
    });
  }
  chooseItem(item) {
    let direccion = item.description;
    var self = this;
    var request = {
      placeId: item.place_id
    };
    let lat_lng;
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.placesService.getDetails(request, callback);
    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log('page > getPlaceDetail > place > ', place);
        let lat_i = place.geometry.location.lat();
        let lng_i = place.geometry.location.lng();
        lat_lng = lat_i + ',' + lng_i;
        console.log(lat_lng);
        let fin = {
          lat_lng: lat_lng,
          direccion: direccion
        }
        localStorage.setItem('fin_pitigo', JSON.stringify(fin));
        self.poligono_fin(fin);
      } else {
        console.log('page > getPlaceDetail > status > ', status);
      }
    }
  }
  ubicar_destino() {
    this.navCtrl.push('DestinoDragPage');
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
