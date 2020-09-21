import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {PrRutasProvider} from '../pr-rutas/pr-rutas';
import 'rxjs/add/operator/map';
@Injectable()
@Injectable()
export class PrCodigoPromoProvider {
	principal_url:any;
  constructor(public http: Http, private pr_rutas:PrRutasProvider){
    this.principal_url=this.pr_rutas.get_route();
  }
  verificar_codigo_promo(datos){
    var variable_2=JSON.stringify(datos);
  	var url = this.principal_url+'codigo_promo/verificar_codigo_promo';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
  guardar_codigo_descuento(datos){
    var variable_2=JSON.stringify(datos);
  	var url = this.principal_url+'codigo_promo/guardar_codigo_descuento';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
}
