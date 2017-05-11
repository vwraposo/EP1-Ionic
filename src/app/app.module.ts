import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpModule } from '@angular/http';
import { QRCodeModule } from 'angular2-qrcode'; 

import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { SeminarList} from '../pages/seminar-list/seminar-list';
import { SeminarPage} from '../pages/seminar-page/seminar-page';
import { EditProfile } from '../pages/edit-profile/edit-profile';

import { CurrentUser } from '../providers/current-user'

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    Login, 
    Signup,
    SeminarList, 
    SeminarPage,
    EditProfile
  ],
  imports: [
    QRCodeModule,
    HttpModule, 
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Signup,
    SeminarList, 
    SeminarPage, 
    EditProfile
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    CurrentUser,
  ]
})
export class AppModule {}
