import { Component, Input, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState } from '../../shared/state/category.state';
import { ExportCategory, GetCategories } from '../../shared/action/category.action';
import { CategoryModel } from '../../shared/interface/category.interface';
import { ImportCsvModalComponent } from "../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  @Select(CategoryState.category) category$: Observable<CategoryModel>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;

  @Input() type: string = 'create';
  @Input() categoryType: string | null = 'product';
  
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new GetCategories({type: this.categoryType}));
  }

  export() {
    this.store.dispatch(new ExportCategory());
  }

  create(type: string) {
    this.router.navigate([type == 'post' ? '/blog/category' : '/category']);
  }

}
