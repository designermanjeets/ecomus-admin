import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { UpdateOrderStatus } from '../../../../shared/action/order.action';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-shipping-note-modal',
  templateUrl: './shipping-note-modal.component.html',
  styleUrl: './shipping-note-modal.component.scss',
})
export class ShippingNoteModalComponent {

  public closeResult: string;
  public modalOpen: boolean = false;
  public orderId: number;
  public statusId: number;
  public date = new FormControl();
  

  @ViewChild("noteModal") NoteModal: TemplateRef<string>;

  constructor(private modalService: NgbModal, private datePipe: DatePipe,
    private store: Store) {
  }

  async openModal(id: number, value: number) {
    this.modalOpen = true;
    this.orderId = id;
    this.statusId = value;
    this.date.patchValue('');
    this.modalService.open(this.NoteModal, {
      ariaLabelledBy: 'Note-Modal',
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'theme-modal'
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
	model: NgbDateStruct;
  submit(modal: NgbModalRef, value: string) {
    const currentDate = new Date();
    this.datePipe.transform(this.date.value ? this.date.value : currentDate, 'yyyy-MM-ddTHH:mm:ss.SSSSSSZ');
    this.store.dispatch(new UpdateOrderStatus(this?.orderId, { order_status_id: Number(this.statusId), note: value, changed_at: this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.SSSSSSZ')!})).subscribe({
      complete: () => {
        modal.dismiss();
      }
    });
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
