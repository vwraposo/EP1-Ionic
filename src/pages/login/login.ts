import { Component } from '@angular/core';
import { MenuController, ToastController, ViewController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FormBuilder, FormGroup } from '@angular/forms';
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

    // Se ja logado
    console.log("verificando se ja esava logado");

    this.storage.get('user_login').then((u_login) => {
      console.log("Getting login: " + u_login);

      if (u_login != null) {
        this.storage.get('user_type').then((u_type) => {

          this.user = new User (u_login,
            "Nome Hardcoded", u_type);

          this.currUser.setUser(this.user);
          console.log (this.user);

          this.navCtrl.push(SeminarList).
            then(() => {
              const index = this.viewCtrl.index;
              this.navCtrl.remove(index);
            });

        });
      }
    });

    // Senao

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

      // Salva no Storage
      this.storage.set('user_login', this.user.nusp);
      this.storage.set('user_type', this.user.is_student);

      // Usuario atual
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
