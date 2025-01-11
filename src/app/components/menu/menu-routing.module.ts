import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { PermissionGuard } from '../../core/guard/permission.guard';
import { EditMenuComponent } from './edit-menu/edit-menu.component';

const routes: Routes = [
  {
    path: "",
    component: MenuComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'menu.index' 
    }
  },
  {
    path: "edit/:id",
    component: EditMenuComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['menu.index', 'menu.edit'] 
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
