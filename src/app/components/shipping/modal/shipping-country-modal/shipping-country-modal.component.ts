import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Select2Data } from 'ng-select2-component';
import { Shipping, ShippingModel } from '../../../../shared/interface/shipping.interface';
import { CountryState } from '../../../../shared/state/country.state';
import { CreateShipping, UpdateShipping } from '../../../../shared/action/shipping.action';
import { ShippingState } from '../../../../shared/state/shipping.state';

@Component({
  selector: 'app-shipping-country-modal',
  templateUrl: './shipping-country-modal.component.html',
  styleUrls: ['./shipping-country-modal.component.scss']
})
export class ShippingCountryModalComponent {

  @Select(CountryState.countries) countries$: Observable<Select2Data>;
  @Select(ShippingState.shipping) shipping$: Observable<ShippingModel>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public form: FormGroup;
  public data: Shipping | null;
  public countries: Select2Data = [];

  @ViewChild("countryShippingModal", { static: false }) CountryShippingModal: TemplateRef<string>;

  constructor(private modalService: NgbModal,
    private store: Store,
    private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      country_id: new FormControl('', [Validators.required]),
      status: new FormControl(1)
    });

    this.shipping$.subscribe(shipping => {
      this.countries$.subscribe(countries => {
        this.countries = countries.filter((country: any) => !shipping.data.map(shipping => Number(shipping.country_id)).includes(Number(country.value)))
      })
    });
  }

  async openModal(data?: Shipping) {
    this.modalOpen = true;
    this.data = null;
    if(data) {
      this.data = data;
      this.form.patchValue({country_id: data?.country_id, status: data?.status});
    }
    this.modalService.open(this.CountryShippingModal, {
      ariaLabelledBy: 'Shipping-country-Modal',
      centered: true,
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

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateShipping(this.form.value);
    if(this.data) {
      action = new UpdateShipping(this.form.value, this.data.id)
    }
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          this.form.controls['country_id'].reset();
          this.modalService.dismissAll(); 
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
