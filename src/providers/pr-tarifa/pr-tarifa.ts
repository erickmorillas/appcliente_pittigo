import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {PrRutasProvider} from '../pr-rutas/pr-rutas';
import 'rxjs/add/operator/map';
@Injectable()
export class PrTarifaProvider{
	principal_url:any;
  constructor(public http: Http, private pr_rutas:PrRutasProvider){
    this.principal_url=this.pr_rutas.get_route();
  }
  get_tarifa(datos){
    var variable_2=JSON.stringify(datos);
  	var url = this.principal_url+'tarifa/get_tarifa';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }

}
