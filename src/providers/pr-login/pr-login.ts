import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {PrRutasProvider} from '../pr-rutas/pr-rutas';
import 'rxjs/add/operator/map';
@Injectable()
export class PrLoginProvider {
	token:any;
	principal_url:any;
  token_2:any;
  constructor(public http: Http, private pr_rutas:PrRutasProvider){
    this.principal_url=this.pr_rutas.get_route();
  }
  set_token(value){
    this.token=value;
  }
  get_token(){
    return this.token;
  }
  set_token_firebase(value){
    this.token_2=value;
  }
  get_token_firebase(){
    return this.token_2;
  }
  get_usuario_login_pass(datos){
    var variable_2=JSON.stringify(datos);
    var url = this.principal_url+'login/get_usuario_login_pass';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
  guardar_usuario_cliente(datos){
    var variable_2=JSON.stringify(datos);
    var url = this.principal_url+'login/guardar_usuario_cliente';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
  recuperar_pass(datos){
    var variable_2=JSON.stringify(datos);
    var url = this.principal_url+'login/recuperar_pass';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
  get_usuario_taxista_id_usuario(datos){
    var variable_2=JSON.stringify(datos);
    var url = this.principal_url+'login/get_usuario_taxista_id_usuario';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
  actualizar_imagen_usuario(datos){
    var variable_2=JSON.stringify(datos);
    var url = this.principal_url+'login/actualizar_imagen_usuario';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }
  actualizar_password(datos){
    var variable_2=JSON.stringify(datos);
    var url = this.principal_url+'login/actualizar_password';
    var response = this.http.post(url,variable_2).map(res => res.json());
    return response;
  }

}
