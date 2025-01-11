import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { GetMenu } from '../../shared/action/menu.action';
import { MenuState } from '../../shared/state/menu.state';
import { Observable } from 'rxjs';
import { MenuModel } from '../../shared/interface/menu.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  @Input() type: string = 'create';

  @Select(MenuState.menu) menu$: Observable<MenuModel>;

  constructor(private store: Store, private router: Router){
    this.store.dispatch(new GetMenu());
  }

  create() {
    this.router.navigateByUrl('/menu');
  }

}
