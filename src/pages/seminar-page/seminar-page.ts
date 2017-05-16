import { Component } from '@angular/core';
import { AlertController, ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Seminar } from '../../models/seminar'
import { User } from '../../models/user'
import { CurrentUser } from '../../providers/current-user'
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-seminar-page',
  templateUrl: 'seminar-page.html',
})
export class SeminarPage {
  selectedSeminar: Seminar;
  user: User;
  students: Array<User>;
  clicked: Boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public currUser: CurrentUser,
    private barcodeScanner: BarcodeScanner,
    public http: HTTP,
    public toastCtrl: ToastController, 
    public alertCtrl: AlertController) {

    this.selectedSeminar = navParams.get('seminar');
    this.user = currUser.getUser();

    this.setupStudentList();
  }

  genQR() {
    if (this.clicked) 
     this.clicked = false;
    else 
      this.clicked = true;
  }

  scanStudents() {
    console.log("Scan Students");
    this.barcodeScanner.scan().then((data) => {
      console.log(data.text.substring(1));
      this.POSTEnroll(data.text.substring(1));
    }, (err) => {
      console.log("Scanning failed: " + err);
      let toast = this.toastCtrl.create({
        message: 'Error: scanning failed',
        duration: 3000
      });
      toast.present();


    });
  }

  deleteSeminar() {
    if (this.students[0] != null) {
      let alert = this.alertCtrl.create({
        title: 'Failed',
        subTitle: 'Impossible to delete. There are students enrolled.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    let prompt = this.alertCtrl.create({
      title: 'Delete seminar?', 
      message: 'You are about to delete this seminar.There is no going back. Are you sure you want to do this?',
      buttons: [
        {
          text: 'Cancel', 
          handler: data => {
            console.log('Cancel delettion');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.POSTDelete(); 
          }
        }
      ]
    });
    prompt.present();
  }

  editSeminar() {
    let prompt = this.alertCtrl.create({
      title: 'Edit Seminar',
      message: "Change the info and then save.", 
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
            let name = data.name;
            if (name == '') {
              this.toastCtrl.create({
                message: 'Error: Invalid parameter',
                duration: 3000
              }).present();
            }
            else {
              this.POSTEdit(name);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  // Requests 

  POSTDelete() {
    let url = "http://207.38.82.139:8001/seminar/delete"

    this.http.post(url, {id : this.selectedSeminar.id}, {'Content-Type':'application/json'})
      .then(data => {
        let result = JSON.parse(data.data);
        if (result.success) {
          this.navCtrl.pop();
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Failed',
            subTitle: 'The seminar was not deleted',
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

  POSTEdit(name) {
    let url = "http://207.38.82.139:8001/seminar/edit";
    let body = { 
      id: this.selectedSeminar.id,
      name: name 
    };

    this.http.post(url, body, {'Content-Type' : 'application/json'})
      .then(data => {
        let result = JSON.parse(data.data);
        if (result.success) {
          console.log("Seminar edited");
          this.selectedSeminar.name = name;
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: '"' + name + '": successfully edited',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.toastCtrl.create({
            message: 'Error: edit failed',
            duration: 3000
          }).present();
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

  setupStudentList() {
    console.log("setup list");
    let url = "http://207.38.82.139:8001/attendence/listStudents";

    let body = { 
      seminar_id : this.selectedSeminar.id,
    };


    this.http.post(url, body, {'Content-Type': 'application/json'})
      .then(data => {
        let result = JSON.parse(data.data);
        if (result.success) {
          console.log('request success');
          this.students = result.data.map(val => {
            return new User(val.student_nusp, true);
          });

        }
      })
      .catch(err => {
        console.log('request failed');
        this.toastCtrl.create({
          message: 'Request failed',
          duration: 3000
        }).present();
      });
  }

  POSTEnroll(nusp) {
    // Check if is seminar
    this.http.get("http://207.38.82.139:8001/student/get/" + nusp, {}, {})
      .then(data => {
        if (JSON.parse(data.data).success) {
          console.log("Aluno valido");
          // Enroll
          this.http.post("http://207.38.82.139:8001/attendence/submit", { nusp: nusp, seminar_id: this.selectedSeminar.id}, {'Content-Type':'application/json'})
            .then(data => {
              if (JSON.parse(data.data).success) {
                this.students.push(new User(nusp, true));
                let alert = this.alertCtrl.create({
                  title: 'Success',
                  subTitle: 'Student enrolled',
                  buttons: ['OK']
                });
                alert.present();
              }
              else {
                let alert = this.alertCtrl.create({
                  title: 'Failed',
                  subTitle: 'Error, try again',
                  buttons: ['OK']
                });
                alert.present();
              }
            }).catch(error => {
              let alert = this.alertCtrl.create({
                title: 'Failed',
                subTitle: 'Error, try again',
                buttons: ['OK']
              });
              alert.present();
            });
        }
      }).catch(error => {
        console.log("Aluno invalido");
        let alert = this.alertCtrl.create({
          title: 'Failed',
          subTitle: 'This is not a valid student.',
          buttons: ['OK']
        });
        alert.present();
      });

  }


}
