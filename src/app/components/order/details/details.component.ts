import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { Observable, Subject, of } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { GetOrderStatus } from '../../../shared/action/order-status.action';
import { DownloadInvoice, ViewOrder } from '../../../shared/action/order.action';
import { OrderStatus, OrderStatusModel } from '../../../shared/interface/order-status.interface';
import { Order, OrderStatusActivities } from '../../../shared/interface/order.interface';
import { OrderStatusState } from '../../../shared/state/order-status.state';
import { OrderState } from '../../../shared/state/order.state';
import { PosInvoiceModalComponent } from '../checkout/modal/pos-invoice-modal/pos-invoice-modal.component';
import { ShippingNoteModalComponent } from './shipping-note-modal/shipping-note-modal.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  @Select(OrderStatusState.orderStatus) orderStatus$: Observable<OrderStatusModel>;
  @Select(OrderStatusState.orderStatuses) orderStatuses$: Observable<Select2Data>;
  
  @ViewChild("posInvoice") PosInvoice: PosInvoiceModalComponent;
  @ViewChild("shippingNote") ShippingNote: ShippingNoteModalComponent;

  public order: Order;
  public statuses: OrderStatus[] = [];
  public init: boolean;
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private datePipe: DatePipe,
    private route: ActivatedRoute) {
    this.store.dispatch(new GetOrderStatus());
    this.init = true;
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new ViewOrder(params['id']))
                      .pipe(mergeMap(() => this.store.select(OrderState.selectedOrder)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(order => {
        this.order = order!
        if(this.order && this.order?.order_status_activities){
          this.order?.order_status_activities?.map(actStatus => {
            this.orderStatus$.subscribe(res => {
              res.data.map(status => {
                if(actStatus.status == status.name){
                  let convertDate = this.datePipe.transform(actStatus?.changed_at, 'dd MMM yyyy hh:mm:a')!
                  status['activities_date'] = convertDate;
                }
              })
           
          })
        })
        }
    });


  }

  updateOrderStatus(data: Select2UpdateEvent) {
    if(data && data?.value) {
      if(!this.init)
        this.ShippingNote.openModal(this.order?.id, Number(data.value));

      this.init = false
    }
  }

  getDate(status: string, order: OrderStatusActivities[]){
    const getdate = order?.map(res => {
      const convertDate = this.datePipe.transform(res?.changed_at, 'dd MMM yyyy hh:mm:a')!
      return status === res.status ? convertDate  : ' '
    })
    return getdate;
  }

  ngOnDestroy() {
    this.statuses = [];
    this.destroy$.next();
    this.destroy$.complete();
  }

  download(id: number){
    this.store.dispatch(new DownloadInvoice({order_number: id}))
  }

}
