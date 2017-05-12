import { Component } from '@angular/core';
import { MenuController, ToastController, ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FormBuilder, FormGroup } from '@angular/forms';

import { User } from '../../models/user' 
import { Login } from '../login/login'
import { SeminarList } from '../seminar-list/seminar-list';
import { CurrentUser } from '../../providers/current-user'

/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
  public user: User;
  signup: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    public currUser: CurrentUser,
    public toastCtrl: ToastController,
    private menu: MenuController, 
    private storage: Storage) {
    this.menu.enable(false, 'side_menu');

    this.signup = formBuilder.group({
      name: [''],
      login: [''],
      password: [''],
      u_type: ['']
    });
  }

  save () {
    console.log (this.signup.value);
    if (this.signup.value.name != '' &&
      this.signup.value.login != '' &&
      this.signup.value.password != '' &&
      this.signup.value.u_type != '') {

      this.user = new User (this.signup.value.login,
        this.signup.value.u_type == "S");


      // Save to local storage
      this.storage.set('user_login', this.user.nusp);
      this.storage.set('user_type', this.user.is_student);

      // Current user
      this.currUser.setUser(this.user);
      console.log(this.user);

      this.navCtrl.push(SeminarList).
        then(() => {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
        });

    } else {
      console.log ("Signup failed");
      let toast = this.toastCtrl.create({
        message: 'Sign Up failed',
        duration: 3000
      });
      toast.present();
    }
  }

  linktoLogin() {
    console.log("Going to Login");
    this.navCtrl.push(Login).
      then(() => {
        // first we find the index of the current view controller:
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      });
  }

}
