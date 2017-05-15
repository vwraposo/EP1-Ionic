import { Component } from '@angular/core';
import { MenuController, ToastController, ViewController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrentUser } from '../../providers/current-user';

import { Signup } from '../signup/signup';
import { User } from '../../models/user';
import { SeminarList } from '../seminar-list/seminar-list';

import { HTTP } from '@ionic-native/http';


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
    private storage: Storage,
    private http: HTTP) {

    this.menu.enable(false, 'side_menu');

    // Se ja logado
    console.log("verificando se ja esava logado");

    this.storage.get('user_login').then((u_login) => {
      console.log("Getting login: " + u_login);

      if (u_login != null) {
        this.storage.get('user_type').then((u_type) => {

          this.user = new User (u_login,
            u_type);

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
    console.log("save clicked");
    if (
      this.login.value.login    != '' && 
      this.login.value.password != '' && 
      this.login.value.u_type   != '') {

      let nusp = this.login.value.login;
      let pass = this.login.value.password;
      let stud = this.login.value.u_type == "S";

      let url = 'http://207.38.82.139:8001/login/';
      url = url + (stud ? "student" : "teacher");

      console.log("Target: "+url);

      let body = {
        nusp: nusp, 
        pass: pass,
      };

      console.log(''+body);

      this.http.post(url, body, {'Content-Type': 'application/json'})
        .then(data => {
          var result = JSON.parse(data.data)
          console.log(result);
          if (result.success) {
            this.user = new User (nusp, stud);

            // Salva no Storage
            this.storage.set('user_login', nusp);
            this.storage.set('user_type', stud);

            // Usuario atual
            this.currUser.setUser(this.user);
            console.log (this.user);


            this.navCtrl.push(SeminarList).
              then(() => {
                const index = this.viewCtrl.index;
                this.navCtrl.remove(index);
              });
          } else {
            console.log("invalid username/password");
            this.toastCtrl.create({
              message: 'Log in failed - invalid input',
              duration: 3000
            }).present();
          }

        }).catch(error => {
          console.log("Request failure");
          let toast = this.toastCtrl.create({
            message: 'Log in failed - No connection to server',
            duration: 3000
          });
          toast.present();
        });


    } else {
      console.log ("invalid input - missing information");
      let toast = this.toastCtrl.create({
        message: 'Log in failed - missing information',
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



}
