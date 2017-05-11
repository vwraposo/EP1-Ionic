import { Component } from '@angular/core';
import { ToastController, ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage'
import { CurrentUser } from '../../providers/current-user'

import { Signup } from '../signup/signup'
import { User } from '../../models/user' 
import { SeminarList } from '../seminar-list/seminar-list' 


/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  public user: User;
  login: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, 
    public navParams: NavParams, public formBuilder: FormBuilder, public currUser: CurrentUser, public toastCtrl: ToastController) {
    this.login = formBuilder.group({
      login: [''],
      password: [''],
      u_type: ['']
    });
  }

  save () {
    if (this.login.value.login != '' && 
      this.login.value.password != '' && 
      this.login.value.u_type != '') {

      this.user = new User (this.login.value.login,
        "Nome Hardcoded", this.login.value.u_type == "S");

      this.currUser.setUser(this.user);
      console.log (this.user);

      this.navCtrl.push(SeminarList).
        then(() => {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
        });

    } else {
      console.log ("invalid input - missing information");
      let toast = this.toastCtrl.create({
        message: 'Log in failed',
        duration: 3000
      });
      toast.present();

    }
  }

  linktoSignup() {
    console.log("going to signup");
    this.navCtrl.push(Signup).
      then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

}
