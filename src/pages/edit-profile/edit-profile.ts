import { Component } from '@angular/core';
import { AlertController, ToastController, NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage'
import { CurrentUser } from '../../providers/current-user'
import { User } from '../../models/user'

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {
  user: User;
  edit: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public currUser: CurrentUser, public formBuilder: FormBuilder, 
    public alertCtrl: AlertController, public toastCtrl: ToastController) {
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
      // Success
      this.user.name = this.edit.value.name;
      this.currUser.setUser(this.user);
      console.log(this.user);

      let alert = this.alertCtrl.create({
              title: 'Success',
              subTitle: 'Your profile was successfully edited.',
              buttons: ['OK']
            });
          alert.present();
    }
    else {
      console.log("Edit failed");
      let toast = this.toastCtrl.create({
        message: 'Edit failed',
        duration: 3000
      });
      toast.present();

    }

  }

  


}
