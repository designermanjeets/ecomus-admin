import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-product-box',
  templateUrl: './demo-product-box.component.html',
  styleUrl: './demo-product-box.component.scss'
})
export class DemoProductBoxComponent {

  public open: boolean = false;

  show(val: boolean){
    this.open = val;
  }
}
