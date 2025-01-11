import { Component, Input } from '@angular/core';
import { Category } from '../../../shared/interface/category.interface';
import { FormControl } from '@angular/forms';
import { Menu } from '../../../shared/interface/menu.interface';

@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrl: './menu-tree.component.scss'
})
export class MenuTreeComponent {

  @Input() type: string;
  @Input() data: Menu[];
  @Input() recursionKey: string;
  @Input() displayKey: string = 'title';
  @Input() categoryType: string | null = 'product';

  public treeSearch = new FormControl('');
  public dataToShow: Menu[] = [];

  constructor() {
    this.treeSearch.valueChanges
        .subscribe(
          (data) => {
        if(data) {
            this.dataToShow = [];
            this.data.forEach(item =>{
              this.hasValue(item) && this.dataToShow.push(item)
            })
        } else {
            this.dataToShow = this.data;
        }
    });
  }

  ngOnChanges() {
    this.dataToShow = this.data;
  }

  hasValue(item: any) {
    let valueToReturn = false;
    if(item[this.displayKey].toLowerCase().includes(this.treeSearch?.value?.toLowerCase())){
      valueToReturn = true;
    }
    item[this.recursionKey]?.length && item[this.recursionKey].forEach((child: Category) => {
      if(this.hasValue(child)) {
        valueToReturn = true;
      }
    });
    return valueToReturn;
  }
}
