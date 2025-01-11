import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ThemeRoutingModule } from './theme-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ThemeComponent } from './theme.component';
import { ParisComponent } from './paris/paris.component';
import { TokyoComponent } from './tokyo/tokyo.component';
import { OsakaComponent } from './osaka/osaka.component';
import { RomeComponent } from './rome/rome.component';
import { MadridComponent } from './madrid/madrid.component';
import { BerlinComponent } from './berlin/berlin.component';
import { DenverComponent } from './denver/denver.component';
import { MoscowComponent } from './moscow/moscow.component';
import { CairoComponent } from './cairo/cairo.component';

// State
import { BlogState } from '../../shared/state/blog.state';
import { ThemeState } from '../../shared/state/theme.state';
import { CategoryState } from '../../shared/state/category.state';
import { ProductState } from '../../shared/state/product.state';
import { BrandState } from '../../shared/state/brand.state';
import { StoreState } from '../../shared/state/store.state';

@NgModule({
  declarations: [
    ThemeComponent,
    ParisComponent,
    TokyoComponent,
    OsakaComponent,
    RomeComponent,
    MadridComponent,
    BerlinComponent,
    DenverComponent,
    MoscowComponent,
    CairoComponent
  ],
  imports: [
    CommonModule,
    ThemeRoutingModule,
    NgxsModule.forFeature([
      BlogState, 
      ThemeState, 
      CategoryState,
      ProductState,
      BrandState,
      StoreState
    ]),
    SharedModule
  ]
})
export class ThemeModule { }
