import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxEditorModule } from 'ngx-editor';

import { NoticeRoutingModule } from './notice-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { NoticeComponent } from './notice.component';
import { CreateNoticeComponent } from './create-notice/create-notice.component';
import { EditNoticeComponent } from './edit-notice/edit-notice.component';
import { FormNoticeComponent } from './form-notice/form-notice.component';

import { NoticeState } from '../../shared/state/notice.state';

@NgModule({
  declarations: [
    NoticeComponent,
    FormNoticeComponent,
    EditNoticeComponent,
    CreateNoticeComponent
  ],
  imports: [
    CommonModule,
    NoticeRoutingModule,
    SharedModule,
    NgxEditorModule,
    NgxsModule.forFeature([NoticeState])
  ]
})
export class NoticeModule { }
