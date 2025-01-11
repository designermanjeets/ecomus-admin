import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeComponent } from './notice.component';
import { PermissionGuard } from '../../core/guard/permission.guard';
import { CreateNoticeComponent } from './create-notice/create-notice.component';
import { EditNoticeComponent } from './edit-notice/edit-notice.component';

const routes: Routes = [
  {
    path: '',
    component: NoticeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'notice.index' 
    }
  },
  {
    path: "create",
    component: CreateNoticeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['notice.index', 'notice.create']
    }
  },
  {
    path: "edit/:id",
    component: EditNoticeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['notice.index', 'notice.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeRoutingModule { }
