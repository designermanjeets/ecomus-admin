import { Component, Input, ViewChild } from '@angular/core';
import { DeleteModalComponent } from '../../../../shared/components/ui/modal/delete-modal/delete-modal.component';
import { Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../../shared/interface/category.interface';
import { DeleteMenu } from '../../../../shared/action/menu.action';

@Component({
  selector: 'app-menu-node-tree',
  templateUrl: './menu-node-tree.component.html',
  styleUrl: './menu-node-tree.component.scss'
})
export class MenuNodeTreeComponent {

  @Input() node: any;
  @Input() recursionKey: string;
  @Input() displayKey: string;
  @Input() categoryType: string | null = 'product';

  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  public showChildrenNode: boolean = true;
  public id: number;

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(){
    this.route.params.subscribe( params => this.id = params['id']);
  }

  delete(actionType: string, data: Category) {
    this.store.dispatch(new DeleteMenu(data.id!)).subscribe({
      complete: () => {
        this.router.navigateByUrl('/menu');
      }
    });
  }

}
