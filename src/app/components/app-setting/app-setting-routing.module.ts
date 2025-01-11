import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSettingComponent } from './app-setting.component';
import { PermissionGuard } from '../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: AppSettingComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'setting.index' 
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppSettingRoutingModule { }
