import { Component } from '@angular/core';
import { NoticeState } from '../../shared/state/notice.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Notice, NoticeModel } from '../../shared/interface/notice.interface';
import { DeleteNotice, GetNotice } from '../../shared/action/notice.action';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { Params } from '../../shared/interface/core.interface';
import { Router } from '@angular/router';
import { AccountState } from '../../shared/state/account.state';
import { Permission } from '../../shared/interface/role.interface';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.scss'
})
export class NoticeComponent {

  @Select(NoticeState.notice) notice$: Observable<NoticeModel>;
  @Select(AccountState.permissions) permissions$: Observable<Permission[]>;

  public role: string;
  public permissions: string[] = [];
  public tableConfig: TableConfig = {
    columns: [
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc'  },
      { title: "priority", dataField: "badge" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "notice.edit",  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "notice.destroy" },
    ],
    data: [] as Notice[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.role = this.store.selectSnapshot(state => state.account && state.account.roleName);
    if(this.role !== 'admin'){
      this.store.dispatch(new GetNotice());
    }

    this.notice$.subscribe(notice => { 
      let notices = notice?.data?.filter((element: Notice) => {
        element.badge = element.priority ? `<div class="status-${element.priority}"><span>${element.priority}</span></div>` : '-';
        return element;
      });
      this.tableConfig.data  = notice ? notices  : [];
      this.tableConfig.total = notice ? notice?.total : 0;
    });
  }

  hasPermission(per: string){
    this.permissions$.subscribe(permission => this.permissions = permission?.map((value: Permission) => value?.name))
    return this.permissions.includes(per);
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetNotice(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
  }

  edit(data: Notice) {
    this.router.navigateByUrl(`/notice/edit/${data.id}`);
  }

  delete(data: Notice) {
    this.store.dispatch(new DeleteNotice(data.id));
  }

}
