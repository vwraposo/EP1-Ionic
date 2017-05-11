import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeminarPage } from './seminar-page';

@NgModule({
  declarations: [
    SeminarPage,
  ],
  imports: [
    IonicPageModule.forChild(SeminarPage),
  ],
  exports: [
    SeminarPage
  ]
})
export class SeminarPageModule {}
