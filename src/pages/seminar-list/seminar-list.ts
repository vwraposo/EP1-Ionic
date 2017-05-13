import { Component } from '@angular/core';
import { MenuController, ToastController, AlertController, NavController, NavParams } from 'ionic-angular';

import { SeminarPage } from '../seminar-page/seminar-page'
import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'

import { CurrentUser } from '../../providers/current-user'

import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

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
    private http: Http) {

    this.menu.enable(true, 'side_menu');
    
    this.user = this.currUser.getUser();
    console.log(this.user);
    
    this.getSeminarList();
    }

  getSeminarList() {
    this.http.get('http://207.38.82.139:8001/seminar').map(res => res.json()).subscribe(
        data => {
            console.log('request success');
            this.seminars = data.data;
        },
        err => {
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
            console.log('New Seminar: ' + data.name );
            this.seminars.push(new Seminar(22, "" + data.name));
          }
        }
      ]
    });
    prompt.present();
  }


itemTapped(event, seminar) {
  this.navCtrl.push(SeminarPage, 
    { seminar: seminar, 
    });
}

}
