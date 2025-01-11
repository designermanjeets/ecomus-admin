import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSettingRoutingModule } from './app-setting-routing.module';
import { AppSettingComponent } from './app-setting.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { SettingState } from '../../shared/state/setting.state';
import { CouponState } from '../../shared/state/coupon.state';
import { ProductState } from '../../shared/state/product.state';
import { CategoryState } from '../../shared/state/category.state';
import { StoreState } from '../../shared/state/store.state';
import { BlogState } from '../../shared/state/blog.state';
import { BrandState } from '../../shared/state/brand.state';


@NgModule({
  declarations: [
    AppSettingComponent
  ],
  imports: [
    CommonModule,
    AppSettingRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      SettingState,
      CouponState,
      ProductState,
      CategoryState,
      StoreState,
      BlogState,
      BrandState
    ])
  ]
})
export class AppSettingModule { }
