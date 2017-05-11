import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeminarList } from './seminar-list';

@NgModule({
  declarations: [
    SeminarList,
  ],
  imports: [
    IonicPageModule.forChild(SeminarList),
  ],
  exports: [
    SeminarList
  ]
})
export class SeminarListModule {}
