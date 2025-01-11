import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Order } from '../../../../../shared/interface/order.interface';
import { SettingState } from '../../../../../shared/state/setting.state';
import { Values } from '../../../../../shared/interface/setting.interface';

@Component({
  selector: 'app-pos-invoice-modal',
  templateUrl: './pos-invoice-modal.component.html',
  styleUrl: './pos-invoice-modal.component.scss'
})
export class PosInvoiceModalComponent {

  public closeResult: string;
  public modalOpen: boolean = false;
  public order: Order;

  @ViewChild("posInvoice") PosInvoice: TemplateRef<string>;
  @Select(SettingState.setting) setting$: Observable<Values>;

  constructor(private modalService: NgbModal) { }

  async openModal(order: Order) {
    this.order = order;
    this.modalOpen = true;
    this.modalService.open(this.PosInvoice, {
      ariaLabelledBy: 'add-customer-Modal',
      centered: true,
      windowClass: 'theme-modal modal-sm invoice-modal'
    }).result.then((result) => {
      `Result ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
