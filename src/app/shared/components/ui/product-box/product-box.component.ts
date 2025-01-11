import { Component, Input, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Product } from '../../../interface/product.interface';
import { CartAddOrUpdate } from '../../../interface/cart.interface';
import { AddToCart } from '../../../action/cart.action';
import { AddtocartComponent } from './modal/addtocart/addtocart.component';
import { SettingState } from '../../../state/setting.state';
import { Values } from '../../../interface/setting.interface';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss']
})
export class ProductBoxComponent {

  @Input() product: Product;

  @ViewChild("addToCartModal") addToCartModal: AddtocartComponent;
  
  @Select(SettingState.setting) setting$: Observable<Values>;

  public cartItems: CartAddOrUpdate;
  public url: string;
  
  constructor(private store: Store) {
    this.setting$.subscribe(setting => {
      this.url = setting.general.site_url;
    });
  }

  addToCart(product: Product, qty: number) {
    const params: CartAddOrUpdate = {
      product_id: product?.id,
      variation_id: "",
      quantity: qty
    }
    this.store.dispatch(new AddToCart(params));
  }

  externalProductLink(link: string) {
    if(link) {
      window.open(link, "_blank");
    }
  }

}
