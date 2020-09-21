import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {PrRutasProvider} from '../pr-rutas/pr-rutas';
import 'rxjs/add/operator/map';
@Injectable()
export class PrCarreraProvider{
	principal_url:any;
  constructor(public http: Http, private pr_rutas:PrRutasProvider){
    this.principal_url=this.pr_rutas.get_route();
  }
 guardar_servicio(datos){
   var variable_2=JSON.stringify(datos);
 	var url = this.principal_url+'servicio/guardar_servicio';
   var response = this.http.post(url,variable_2).map(res => res.json());
   return response;
 }
 get_carreras_id_usuario(datos){
   var variable_2=JSON.stringify(datos);
 	var url = this.principal_url+'servicio/get_servicio_id_usuario_cliente';
   var response = this.http.post(url,variable_2).map(res => res.json());
   return response;
 }
 crear_cupon_automatico_id_usuario(datos){
   var variable_2=JSON.stringify(datos);
   var url = this.principal_url+'codigo_promo/crear_cupon_automatico_id_usuario';
   var response = this.http.post(url,variable_2).map(res => res.json());
   return response;
 }
}
