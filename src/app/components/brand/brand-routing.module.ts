import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrandComponent } from './brand.component';
import { CreateBrandComponent } from './create-brand/create-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: BrandComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'brand.index'
    }
  },
  {
    path: "create",
    component: CreateBrandComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['brand.index', 'brand.create']
    }
  },
  {
    path: "edit/:id",
    component: EditBrandComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['brand.index', 'brand.edit']
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
