import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { MenuRoutingModule } from './menu-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { MenuComponent } from './menu.component';
import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { MenuNodeTreeComponent } from './menu-tree/menu-node-tree/menu-node-tree.component';
import { FormMenuComponent } from './form-menu/form-menu.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';

import { MenuState } from '../../shared/state/menu.state';
import { ProductState } from '../../shared/state/product.state';
import { BlogState } from '../../shared/state/blog.state';
import { PageState } from '../../shared/state/page.state';


@NgModule({
  declarations: [
    MenuComponent,
    MenuTreeComponent,
    MenuNodeTreeComponent,
    FormMenuComponent,
    EditMenuComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MenuState, ProductState, BlogState, PageState])
  ]
})
export class MenuModule { }
