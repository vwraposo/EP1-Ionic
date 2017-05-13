import { Component } from '@angular/core';
import { MenuController, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public currUser: CurrentUser, 
    public formBuilder: FormBuilder, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    private menu: MenuController, 
    private storage: Storage) {
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
      // Success
      //this.user.name = this.edit.value.name;

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
