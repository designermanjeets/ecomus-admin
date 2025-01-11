import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { SubscriptionComponent } from './subscription.component';

import { SubscriptionState } from '../../shared/state/subscription.state';

@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
    NgxsModule.forFeature([SubscriptionState])
  ]
})
export class SubscriptionModule { }
