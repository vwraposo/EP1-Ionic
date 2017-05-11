import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'
import { CurrentUser } from '../../providers/current-user'
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';




@Component({
  selector: 'page-seminar-page',
  templateUrl: 'seminar-page.html',
})
export class SeminarPage {
  selectedSeminar: Seminar;
  user: User;
  students: Array<User>;
  clicked: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public currUser: CurrentUser, private barcodeScanner: BarcodeScanner, public http: Http, public toastCtrl: ToastController) {
    this.selectedSeminar = navParams.get('seminar');
    this.user = currUser.getUser();

    // POST lista de alunos
    this.students = [];
    for(let i = 1; i < 10; i++) {
      this.students.push(new User("" + i, "Nome", true));
    }
  }

  genQR() {
    if (this.clicked) 
     this.clicked = false;
    else 
      this.clicked = true;
  }

  scanQR() {
    console.log("Scan QR");
    this.barcodeScanner.scan().then((data) => {
      // Success! Barcode data is here
      console.log(data.text);
    }, (err) => {
      // An error occurred
      console.log("Scanning failed: " + err);
    });
  }
}
