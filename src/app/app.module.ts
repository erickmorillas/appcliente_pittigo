import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PrRutasProvider } from '../providers/pr-rutas/pr-rutas';
import { PrLoginProvider } from '../providers/pr-login/pr-login';
import {HttpModule} from '@angular/http';
import { PrEstiloMapaProvider } from '../providers/pr-estilo-mapa/pr-estilo-mapa';
import { PrAlertToastProvider } from '../providers/pr-alert-toast/pr-alert-toast';
import { OneSignal } from '@ionic-native/onesignal';
import { Geolocation } from '@ionic-native/geolocation';
import { PrTarifaProvider } from '../providers/pr-tarifa/pr-tarifa';
import { PrDistanciaProvider } from '../providers/pr-distancia/pr-distancia';
import { PrPerimetroProvider } from '../providers/pr-perimetro/pr-perimetro';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GoogleMaps,Geocoder } from '@ionic-native/google-maps';
import { PrCategoriaProvider } from '../providers/pr-categoria/pr-categoria';
import { PrZonaProvider } from '../providers/pr-zona/pr-zona';
import { PrCarreraProvider } from '../providers/pr-carrera/pr-carrera';
import { PrComentarioProvider } from '../providers/pr-comentario/pr-comentario';
import { PrEmailEmergenciaProvider } from '../providers/pr-email-emergencia/pr-email-emergencia';
import { SMS } from '@ionic-native/sms';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Base64 } from '@ionic-native/base64';
import { CallNumber } from '@ionic-native/call-number';
import { PrCodigoPromoProvider } from '../providers/pr-codigo-promo/pr-codigo-promo';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { PrMensajeProvider } from '../providers/pr-mensaje/pr-mensaje';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import * as firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyDClQwe6n0iShd3CMr8143rLM3yR7FurVI",
    authDomain: "pittigo-c513f.firebaseapp.com",
    databaseURL: "https://pittigo-c513f.firebaseio.com",
    projectId: "pittigo-c513f",
    storageBucket: "pittigo-c513f.appspot.com",
    messagingSenderId: "241832247477",
    appId: "1:241832247477:web:b59785066843776cad3efc"
  };
firebase.initializeApp(firebaseConfig);
@NgModule({ 
  declarations:[
    MyApp,
  ],
    imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
      HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireDatabaseModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PrRutasProvider,
    PrLoginProvider,
    PrEstiloMapaProvider,
    PrAlertToastProvider,
    PrTarifaProvider,
    PrDistanciaProvider,
    PrPerimetroProvider,
    PrCategoriaProvider,
    PrZonaProvider,
    PrCarreraProvider,
    PrComentarioProvider,
    PrEmailEmergenciaProvider,
    PrCodigoPromoProvider,
    Geolocation,
    SMS,
    NativeGeocoder,
    GoogleMaps,
    Geocoder,
    File,
    Transfer,
    FilePath,
    Camera,
    Base64,
    SocialSharing,
    AndroidPermissions,
    PrMensajeProvider,
    CallNumber,
    Diagnostic
  ]
})
export class AppModule {}
