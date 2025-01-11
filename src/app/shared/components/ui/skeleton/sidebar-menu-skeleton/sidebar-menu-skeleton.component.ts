import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Values } from "../../../../interface/setting.interface";
import { SettingState } from '../../../../state/setting.state';

@Component({
  selector: 'app-sidebar-menu-skeleton',
  templateUrl: './sidebar-menu-skeleton.component.html',
  styleUrls: ['./sidebar-menu-skeleton.component.scss']
})
export class SidebarMenuSkeletonComponent {

  @Input() loading: boolean = false;
  
  @Select(SettingState.setting) setting$: Observable<Values>;

  public skeletonItems = Array.from({ length: 20 }, (_, index) => index);

}
