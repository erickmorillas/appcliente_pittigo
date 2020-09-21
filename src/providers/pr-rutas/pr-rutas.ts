import { Injectable } from '@angular/core';

@Injectable()
export class PrRutasProvider {
	route:any='https://pittigo.com/api_rest/'; //http://apirestdelivery.chiguara.com/api_rest   http://192.168.1.100//
  ruta_imagenes='https://pittigo.com/panel/assets/img/'; /*http://chiguara.com/web_delivery/assets/img/ OJO*/
	tipo_seleccion:any;
  constructor(){
  }
  get_route(){
  	return this.route;
  }
  get_ruta_imagenes(){
    return this.ruta_imagenes;
  }

}
