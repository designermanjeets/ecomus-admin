import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingState } from '../../../../state/setting.state';
import { Values } from '../../../../interface/setting.interface';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.scss']
})
export class ModeComponent {

  @Select(SettingState.setting) setting$: Observable<Values>;
  
  public mode: boolean;

  constructor(){
    this.setting$.subscribe(res => this.mode = res.general.mode === 'dark-only' ? true : false)
  }

  customizeLayoutDark() {
    this.mode = !this.mode;
    document.body.classList.toggle('dark-only');
  }
}
