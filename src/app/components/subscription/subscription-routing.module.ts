import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import { PermissionGuard } from '../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: "",
    component: SubscriptionComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'subscribe.index' 
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
