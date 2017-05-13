import { Component } from '@angular/core';
import { MenuController, ViewController, ToastController, AlertController, NavController, NavParams } from 'ionic-angular';

import { SeminarPage } from '../seminar-page/seminar-page'
import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'

import { CurrentUser } from '../../providers/current-user'

import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

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
    public viewCtrl: ViewController,
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
            let myHeaders = new Headers();
            myHeaders.append('Content-Type','application/json');

            let myOpts = new RequestOptions({headers: myHeaders});

            let myBody = JSON.stringify({
                name: data.name
            });

            this.http.post('http://207.38.82.139:8001/seminar/add',myBody,myOpts)
                .map(res => res.json()).subscribe(
                data => {
                    console.log('REQUEST DATA: '+data.success);
                    if (data.success) {
                        console.log('new seminar ok, updating');
                        this.toastCtrl.create({
                            message: "Seminar successfully created!",
                            duration:3000
                        }).present();
                        this.navCtrl.push(SeminarList).
                            then(() => {
                                const index = this.viewCtrl.index;
                                this.navCtrl.remove(index);
                            });
                    } else {
                        console.log('request returned false');
                        this.toastCtrl.create({
                            message: data.success,
                            duration: 3000
                        }).present();
                    }
                },
                err => {
                    console.log('request failed');
                    this.toastCtrl.create({
                        message: "Request failed - check your connection",
                        duration: 3000
                    }).present();
                });
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
