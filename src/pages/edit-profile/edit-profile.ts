import { Component } from '@angular/core';
import { MenuController, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrentUser } from '../../providers/current-user'
import { User } from '../../models/user'

import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {
  user: User;
  edit: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public currUser: CurrentUser, 
    public formBuilder: FormBuilder, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    private menu: MenuController, 
    private storage: Storage, 
    private http: HTTP) {
    this.menu.enable(true, 'side_menu');

    this.user = this.currUser.getUser();
    console.log(this.user);

    this.edit = formBuilder.group({
      name: [''], 
      password: [''],
    });
  }

  save() {
    if (this.edit.value.name != '' && this.edit.value.password != ''){
      // POST edit
      let nusp = this.user.nusp;
      let name = this.edit.value.name;
      let pass = this.edit.value.password;
      let stud = this.user.is_student;
      
      let url = 'http://207.38.82.139:8001/';
      url = url + (stud ? "student" : "teacher") + '/edit';

      console.log("Target: "+url);

      let body = {
        nusp: nusp, 
        pass: pass,
        name: name,
      };

      console.log(''+body);

      this.http.post(url, body, {'Content-Type':'application/json'})
        .then(data => {
          let result = JSON.parse(data.data);
          if (result.success) {
            console.log("Edit success");
            // Save to local storage
            this.storage.set('user_login', this.user.nusp);
            this.storage.set('user_type', this.user.is_student);

            // Current user
            this.currUser.setUser(this.user);
            console.log(this.user);

            let alert = this.alertCtrl.create({
              title: 'Success',
              subTitle: 'Your profile was successfully edited.',
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
    else {
      console.log("Edit failed");
      let toast = this.toastCtrl.create({
        message: 'Error: Invalid parameters',
        duration: 3000
      });
      toast.present();

    }

  }




}
