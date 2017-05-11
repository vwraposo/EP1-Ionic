import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'

import { SeminarPage } from '../seminar-page/seminar-page'
import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'

import { CurrentUser } from '../../providers/current-user'

@Component({
  selector: 'page-seminar-list',
  templateUrl: 'seminar-list.html',
})
export class SeminarList {
  seminars: Array<Seminar>;
  user: User;
  user_id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public currUser: CurrentUser, public alertCtrl: AlertController) {
    this.user = this.currUser.getUser();
    console.log(this.user);

    // GET Seminar list
    this.seminars = [];
    for(let i = 1; i < 20; i++) {
      this.seminars.push(new Seminar(i, "Seminario" + i));
    }
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
