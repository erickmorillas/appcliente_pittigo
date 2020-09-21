import { Component,ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {PrAlertToastProvider} from '../../providers/pr-alert-toast/pr-alert-toast';
import {PrTarifaProvider} from '../../providers/pr-tarifa/pr-tarifa';
import {PrZonaProvider} from '../../providers/pr-zona/pr-zona';
import { Geolocation } from '@ionic-native/geolocation';
import SlidingMarker from "marker-animate-unobtrusive";
import { Geocoder } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import * as firebase from 'firebase';
declare var google;
@IonicPage()
@Component({
  selector: 'page-destino-drag',
  templateUrl: 'destino-drag.html',
})
export class DestinoDragPage {
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
  en_linea_conductor:any;
  id_modo_tarifa:any;
  id_zona_inicio:any;
  id_zona:any;
  zona_1:any[]=[];
  zona_2:any[]=[];
  zona_3:any[]=[];
  zona_4:any[]=[];
  zona_5:any[]=[];
  zona_6:any[]=[];
  zona_7:any[]=[];
  zona_8:any[]=[];
  zona_9:any[]=[];
  zona_10:any[]=[];
  precio:any;
  la_calle:any;
  fin:any;
  det_zona_lat_long:any;
  constructor(public navCtrl: NavController, public translate:TranslateService, public pr_alert_toast:PrAlertToastProvider, public geolocation:Geolocation, public pr_tarifa:PrTarifaProvider,public nativeGeocoder:NativeGeocoder, public geocoder:Geocoder, public pr_zona:PrZonaProvider,){
  	var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  	let fecha_actual=(new Date(Date.now() - tzoffset)).toISOString().slice(0, -1) + 'Z';
  	console.log(fecha_actual);
  	this.fecha=fecha_actual;
  	let fecha_sola=this.fecha.split('T');
  	let fecha_siete=Date.parse(fecha_sola['0']+' 19:00');
    let fecha_dia=Date.parse(fecha_sola['0']+' 22:00');
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
    /*verifico el modo de tarifa que voy a cobrar*/
    if(fecha_actual_2>fecha_dia){
      this.id_modo_tarifa=2;
      console.log('mayor');
      console.log(this.estilo_mapa);
    }else{
      this.id_modo_tarifa=1;
      console.log('menor');
      console.log(this.estilo_mapa);
    }
     localStorage.setItem('modo_tarifa_pitigo',JSON.stringify(this.id_modo_tarifa));
    /*********************************************/
  }
  search(){
    this.navCtrl.setRoot('SearchPage');
  }
  ionViewDidLoad(){
   this.loadMap();
   this.get_zonas();
  }
  get_zonas(){
   let mensaje='Cargando';
   this.pr_alert_toast.show_loading(mensaje);
   this.pr_zona.get_zona_lat_long('').subscribe(
    pr_zona=>{
    this.pr_alert_toast.dismis_loading();
      let resultado=pr_zona;
      if(resultado.status==true){
        let data=resultado.data;
        this.det_zona_lat_long=data;
         for(let value of data){
          if(value.id_zona==1){
            this.zona_1.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==2){
            this.zona_2.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==3){
            this.zona_3.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==4){
            this.zona_4.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==5){
            this.zona_5.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==6){
            this.zona_6.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==7){
            this.zona_7.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==8){
            this.zona_8.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==9){
            this.zona_9.push({
              lat:value.lat,
              long:value.long
            })
          }else if(value.id_zona==10){
            this.zona_10.push({
              lat:value.lat,
              long:value.long
            })
          }
         }
         this.locacion_inicio();
      }
    },
    err => {
      console.log('el error '+err);
    },
   );
  }
  get_tarifa(){
     let mensaje='Cargando';
     this.pr_alert_toast.show_loading(mensaje);
     this.pr_tarifa.get_tarifa('').subscribe(
      pr_tarifa=>{
      this.pr_alert_toast.dismis_loading();
        let resultado=pr_tarifa;
        if(resultado.status==true){
          let data=resultado.data;
           for(let value of data){
            if(this.id_zona_inicio==1){ /* toma el precio de la zona fin para ir al destino*/
              if(this.id_zona==value.id_zona && this.id_modo_tarifa==value.id_modo_tarifa){
                console.log(value.id_zona);
                this.precio=value.precio;
                localStorage.setItem('precio_carrera',JSON.stringify(this.precio));
              }
            }else{
              /* toma el precio de la zona inicio para ir al destino */
              if(this.id_zona_inicio==value.id_zona && this.id_modo_tarifa==value.id_modo_tarifa){
                console.log(value.id_zona);
                this.precio=value.precio;
                 localStorage.setItem('precio_carrera',JSON.stringify(this.precio));
              }
            }
           }
           this.navCtrl.setRoot('Locatino_selectedPage');
        }
        console.log(this.precio);
      },
      err => {console.log('el error '+err);
      },
     );
  
  }
  loadMap(){
    let lat_long=JSON.parse(localStorage.getItem('lat_long_cliente_pitigo'));
    let lat_long_2=lat_long.split(',');
    let lat=parseFloat(lat_long_2['0']);
    let long=parseFloat(lat_long_2['1']);
    let latLng = new google.maps.LatLng(lat,long);
    this.lat_long=latLng;
    this.lat_long=latLng;
    console.log(this.lat_long);
    let mapOptions={
      center: latLng,
      zoom: 15,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
		this.localizacion_inversa(this.latitud,this.longitud);
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    setTimeout(()=>{
     this.obtener_markers();
     this.position_Marker();
    /* this.Position_Marker();*/
     },2000);
  }
  position_Marker(){
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
  Position_lat_lng(marker, content){
    /*let infoWindow = new google.maps.InfoWindow({
      content: content
    }); */
    google.maps.event.addListener(marker, 'dragend', () =>{
      let latitud=marker.getPosition().lat();
      let longitud=marker.getPosition().lng();
      this.localizacion_inversa(latitud,longitud);
      /*infoWindow.open(this.map, marker);*/
    });
  }
   localizacion_inversa(lat_i,lng_i){
    let latitud=lat_i;
    let longitud=lng_i;
    let options: NativeGeocoderOptions ={
    useLocale: true,
    maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitud,longitud, options)
    .then((result: NativeGeocoderReverseResult[]) =>{
      console.log(result[0]);
      this.calle=result[0].thoroughfare+','+result[0].subThoroughfare+','+result[0].postalCode;
      console.log(this.calle);
      let loc_fin={
        lat_lng:latitud+','+longitud,
        direccion:this.calle
      }
      this.fin=loc_fin;
      localStorage.setItem('fin_pitigo',JSON.stringify(loc_fin));
    }
    )
    .catch((error: any) => {
      this.calle='La calle';
      let loc_fin={
        lat_lng:latitud+','+longitud,
        direccion:this.calle
      }
      this.fin=loc_fin;
      console.log(loc_fin);
      localStorage.setItem('fin_pitigo',JSON.stringify(loc_fin));
    });
   
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
   locacion_inicio(){
    let direccion= JSON.parse(localStorage.getItem('inicio_pitigo'));
    this.la_calle=direccion['direccion'];
    let lat_long=direccion['lat_long'];
    console.log(lat_long);
    this.poligono_inicio(lat_long);
  }
  poligono_inicio(item){
    let fin=item;
    let lat_long_2=fin.split(',');
    let latLng = new google.maps.LatLng(lat_long_2['0'],lat_long_2['1']);
    let zona_11:any[]=[];
    let zona_21:any[]=[];
    let zona_31:any[]=[];
    let zona_41:any[]=[];
    let zona_51:any[]=[];
    let zona_61:any[]=[];
    let zona_71:any[]=[];
    let zona_81:any[]=[];
    let zona_91:any[]=[];
    let zona_101:any[]=[];
     for(let value of this.zona_1){
      zona_11.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_2){
      zona_21.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_3){
      zona_31.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_4){
      zona_41.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_5){
      zona_51.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_6){
      zona_61.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_7){
      zona_71.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_8){
      zona_81.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_9){
      zona_91.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_10){
      zona_101.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
    let zona_1= new google.maps.Polygon({
      paths: zona_11
    });
   let zona_2= new google.maps.Polygon({
      paths: zona_21
    });
   let zona_3= new google.maps.Polygon({
      paths: zona_31
    });
   let zona_4= new google.maps.Polygon({
      paths: zona_41
    });
   let zona_5= new google.maps.Polygon({
      paths: zona_51
    });
   let zona_6= new google.maps.Polygon({
      paths: zona_61
    });
   let zona_7= new google.maps.Polygon({
      paths: zona_71
    });
   let zona_8= new google.maps.Polygon({
      paths: zona_81
    });
   let zona_9= new google.maps.Polygon({
      paths: zona_91
    });
   let zona_10= new google.maps.Polygon({
      paths: zona_101
    });
   console.log(zona_1);
   
  if(google.maps.geometry.poly.containsLocation(latLng, zona_1)==true){
    this.id_zona_inicio=1;
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_2)==true){
    this.id_zona_inicio=2;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_3)==true){
    this.id_zona_inicio=3;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_4)==true){
    this.id_zona_inicio=4;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_5)==true){
    this.id_zona_inicio=5;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_6)==true){
    this.id_zona_inicio=6;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_7)==true){
    this.id_zona_inicio=7;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_8)==true){
    this.id_zona_inicio=8;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_9)==true){
    this.id_zona_inicio=9;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_10)==true){
    this.id_zona_inicio=10;
  }else{
    this.id_zona_inicio=5;
  }
  console.log(this.id_zona_inicio);
 /* self.navCtrl.setRoot('Locatino_selectedPage');*/
  }
  poligono_fin(){
    let fin=this.fin;
    console.log(this.fin);
    let lat_long_2=fin['lat_lng'].split(',');
    let latLng = new google.maps.LatLng(lat_long_2['0'],lat_long_2['1']);
    let zona_11:any[]=[];
    let zona_21:any[]=[];
    let zona_31:any[]=[];
    let zona_41:any[]=[];
    let zona_51:any[]=[];
    let zona_61:any[]=[];
    let zona_71:any[]=[];
    let zona_81:any[]=[];
    let zona_91:any[]=[];
    let zona_101:any[]=[];
     for(let value of this.zona_1){
      zona_11.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_2){
      zona_21.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_3){
      zona_31.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_4){
      zona_41.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_5){
      zona_51.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_6){
      zona_61.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_7){
      zona_71.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_8){
      zona_81.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_9){
      zona_91.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
     for(let value of this.zona_10){
      zona_101.push(
        new google.maps.LatLng(value.lat, value.long)
      )
     }
    let zona_1= new google.maps.Polygon({
      paths: zona_11
    });
   let zona_2= new google.maps.Polygon({
      paths: zona_21
    });
   let zona_3= new google.maps.Polygon({
      paths: zona_31
    });
   let zona_4= new google.maps.Polygon({
      paths: zona_41
    });
   let zona_5= new google.maps.Polygon({
      paths: zona_51
    });
   let zona_6= new google.maps.Polygon({
      paths: zona_61
    });
   let zona_7= new google.maps.Polygon({
      paths: zona_71
    });
   let zona_8= new google.maps.Polygon({
      paths: zona_81
    });
   let zona_9= new google.maps.Polygon({
      paths: zona_91
    });
   let zona_10= new google.maps.Polygon({
      paths: zona_101
    });
   
  if(google.maps.geometry.poly.containsLocation(latLng, zona_1)==true){
    this.id_zona=1;
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_2)==true){
    this.id_zona=2;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_3)==true){
    this.id_zona=3;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_4)==true){
    this.id_zona=4;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_5)==true){
    this.id_zona=5;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_6)==true){
    this.id_zona=6;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_7)==true){
    this.id_zona=7;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_8)==true){
    this.id_zona=8;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_9)==true){
    this.id_zona=9;
    
  }else if(google.maps.geometry.poly.containsLocation(latLng, zona_10)==true){
    this.id_zona=10;
  }else{
    this.id_zona=5;
  }
  console.log(this.id_zona);
  this.get_tarifa();
  
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
