import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { BrandRoutingModule } from './brand-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { BrandComponent } from './brand.component';
import { CreateBrandComponent } from './create-brand/create-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { FormBrandComponent } from './form-brand/form-brand.component';

// State
import { BrandState } from '../../shared/state/brand.state';

@NgModule({
  declarations: [
    BrandComponent,
    CreateBrandComponent,
    EditBrandComponent,
    FormBrandComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    SharedModule,
    NgxsModule.forFeature([BrandState])
  ]
})
export class BrandModule { }
