import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { LicenseKeyRoutingModule } from './license-key-routing.module';

import { LicenseKeyComponent } from './license-key.component';
import { CreateLicenseKeyComponent } from './create-license-key/create-license-key.component';
import { EditLicenseKeyComponent } from './edit-license-key/edit-license-key.component';
import { FormLicenseKeyComponent } from './form-license-key/form-license-key.component';

// State
import { ProductState } from '../../shared/state/product.state';
import { LicenseKeysState } from '../../shared/state/license-key.state';

@NgModule({
  declarations: [
    LicenseKeyComponent,
    CreateLicenseKeyComponent,
    EditLicenseKeyComponent,
    FormLicenseKeyComponent
  ],
  imports: [
    CommonModule,
    LicenseKeyRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ProductState, LicenseKeysState])
  ]
})
export class LicenseKeyModule { }
