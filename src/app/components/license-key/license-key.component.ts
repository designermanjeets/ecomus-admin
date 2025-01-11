import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetLicenseKeys, UpdateLicenseKeyStatus, DeleteLicenseKey, DeleteAllLicenseKey } from '../../shared/action/license-key.actions';
import { Params } from '../../shared/interface/core.interface';
import { LicenseKey, LicenseKeyModel } from '../../shared/interface/license-key.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { LicenseKeysState } from '../../shared/state/license-key.state';

@Component({
  selector: 'app-license-key',
  templateUrl: './license-key.component.html',
  styleUrl: './license-key.component.scss'
})
export class LicenseKeyComponent {

  @Select(LicenseKeysState.licenseKey) licenseKey$: Observable<LicenseKeyModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "product", dataField: "item_name"  },
      { title: "license_key", dataField: "license_key", sortable: true, sort_direction: 'desc'  },
      { title: "purchased_by", dataField: "purchased_by.name"  },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
    ],
    data: [] as LicenseKey[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.licenseKey$.subscribe(licenseKey => { 
      this.tableConfig.data  = licenseKey ? licenseKey?.data  : [];
      this.tableConfig.total = licenseKey ? licenseKey?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetLicenseKeys(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
    this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: LicenseKey) {
    this.router.navigateByUrl(`/license-key/edit/${data.id}`);
  }

  status(data: LicenseKey) {
    this.store.dispatch(new UpdateLicenseKeyStatus(data.id, data.status));
  }

  delete(data: LicenseKey) {
    this.store.dispatch(new DeleteLicenseKey(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllLicenseKey(ids));
  }

}
