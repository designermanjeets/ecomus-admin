import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LicenseKeyComponent } from './license-key.component';
import { CreateLicenseKeyComponent } from './create-license-key/create-license-key.component';
import { EditLicenseKeyComponent } from './edit-license-key/edit-license-key.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: LicenseKeyComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'license_key.index' 
    }
  },
  {
    path: "create",
    component: CreateLicenseKeyComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['license_key.index', 'license_key.create']
    }
  },
  {
    path: "edit/:id",
    component: EditLicenseKeyComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['license_key.index', 'license_key.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseKeyRoutingModule { }
