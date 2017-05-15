import { Component } from '@angular/core';
import { MenuController, ToastController, AlertController, NavController, NavParams } from 'ionic-angular';

import { SeminarPage } from '../seminar-page/seminar-page'
import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'

import { CurrentUser } from '../../providers/current-user'
import { HTTP } from '@ionic-native/http';


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
    private http: HTTP) {

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
    this.navCtrl.push(SeminarPage, 
      { seminar: seminar, 
      });
  }

}
