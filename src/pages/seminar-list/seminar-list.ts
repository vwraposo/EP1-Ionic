import { Component } from '@angular/core';
import { MenuController, ToastController, AlertController, NavController, NavParams } from 'ionic-angular';

import { SeminarPage } from '../seminar-page/seminar-page'
import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'

import { CurrentUser } from '../../providers/current-user'
import { HTTP } from '@ionic-native/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-seminar-list',
  templateUrl: 'seminar-list.html',
})
export class SeminarList {
  //seminars: Array<Seminar>;
  seminars: any;
  user: User;
  user_id: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public currUser: CurrentUser,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private menu: MenuController,
    private http: HTTP,
    private barcodeScanner: BarcodeScanner,) {

    this.menu.enable(true, 'side_menu');

    this.user = this.currUser.getUser();
    console.log(this.user);

    this.getSeminarList();
  }

  getSeminarList() {
    this.http.get('http://207.38.82.139:8001/seminar', {}, {})
      .then(data => {
        console.log('request success');
        this.seminars = JSON.parse(data.data).data;
      })
      .catch(err => {
        console.log('request failed');
        this.toastCtrl.create({
          message: 'Request failed',
          duration: 3000
        }).present();
      });
  }

  addSeminar() {
    let prompt = this.alertCtrl.create({
      title: 'New Seminar',
      message: "Enter a name for this new seminar", 
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data.name;
            console.log('New Seminar: ' + name);
            if (name == '') {
              this.toastCtrl.create({
                message: 'Error: Invalid parameter',
                duration: 3000
              }).present();

            }
            else {
              this.POSTNewSeminar(name);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  scanQR() {
    console.log("Scan QR");
    this.barcodeScanner.scan().then((data) => {
      console.log(data.text);
      this.POSTEnroll(data.text);
    }, (err) => {
      console.log("Scanning failed: " + err);
      let toast = this.toastCtrl.create({
        message: 'Error: scanning failed',
        duration: 3000
      });
      toast.present();
    });
  }

  POSTEnroll(seminar_id) {
    // Check if is seminar
    this.http.get("http://207.38.82.139:8001/seminar/get/" + seminar_id, {}, {})
      .then(data => {
        if (JSON.parse(data.data).success) {
          console.log("Seminario valido");
          // Enroll
          this.http.post("http://207.38.82.139:8001/attendence/submit", { nusp: this.user.nusp, seminar_id: seminar_id}, {'Content-Type':'application/json'})
            .then(data => {
              if (JSON.parse(data.data).success) {
                let alert = this.alertCtrl.create({
                  title: 'Success',
                  subTitle: 'You are enrolled!',
                  buttons: ['OK']
                });
                alert.present();

              }
              else {
                let alert = this.alertCtrl.create({
                  title: 'Failed',
                  subTitle: 'Error, try again',
                  buttons: ['OK']
                });
                alert.present();
              }
            }).catch(error => {
              console.log("Request failure");
              let toast = this.toastCtrl.create({
                message: 'Error: No connection to server',
                duration: 3000
              });
              toast.present();
            });
        } 
      }).catch(error => {
          console.log("Seminario invalido");
          let alert = this.alertCtrl.create({
            title: 'Failed',
            subTitle: 'This is not a valid seminar.',
            buttons: ['OK']
          });
          alert.present();
      });
  }

  POSTNewSeminar(name) {
    let url = "http://207.38.82.139:8001/seminar/add";
    let body = { name: name };

    this.http.post(url, body, {'Content-Type' : 'application/json'})
      .then(data => {
        let result = JSON.parse(data.data);
        if (result.success) {
          console.log("Seminar created");
          this.getSeminarList();
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: '"' + name + '": successfully created',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.toastCtrl.create({
            message: 'Error: creation failed',
            duration: 3000
          }).present();
        }
      }).catch(error => {
        console.log("Request failure");
        let toast = this.toastCtrl.create({
          message: 'Error: No connection to server',
          duration: 3000
        });
        toast.present();
      });
  }


  itemTapped(event, seminar) {
    if (!this.user.is_student) {
      this.navCtrl.push(SeminarPage, 
        { seminar: seminar, 
        });
    }
  }

}
