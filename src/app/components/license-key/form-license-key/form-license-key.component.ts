import { Component, Input, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Select2, Select2Data, Select2SearchEvent, Select2UpdateEvent } from 'ng-select2-component';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil, debounceTime } from 'rxjs/operators';
import { GetProducts } from '../../../shared/action/product.action';
import { ProductState } from '../../../shared/state/product.state';
import { LicenseKey } from "../../../shared/interface/license-key.interface";
import { LicenseKeysState } from '../../../shared/state/license-key.state';
import { CreateLicenseKey, EditLicenseKey, UpdateLicenseKey } from '../../../shared/action/license-key.actions';

@Component({
  selector: 'app-form-license-key',
  templateUrl: './form-license-key.component.html',
  styleUrl: './form-license-key.component.scss'
})
export class FormLicenseKeyComponent {

  @Input() type: string;

  @Select(ProductState.digitalProducts) product$: Observable<Select2Data>;  

  public form: FormGroup;
  public licenseKey: LicenseKey | null;
  private search = new Subject<string>();
  private destroy$ = new Subject<void>();

  public separators: Select2Data = [{
    value: 'comma',
    label: 'Comma ( , )',
  },{
    value: 'semicolon',
    label: 'Semicolon ( ; )',
  },{
    value: 'pipe',
    label: 'Pipe ( | )',
  },{
    value: 'newline',
    label: 'Newline',
  }];

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) { 
      this.form = this.formBuilder.group({
        license_key: new FormControl('', [Validators.required]),
        separator: new FormControl('', [Validators.required]),
        product_id: new FormControl('', [Validators.required]),
        variation_id: new FormControl(''),
        status: new FormControl(1)
      });
  }

  ngOnInit() {
    this.store.dispatch(new GetProducts({ status: 1, is_approved: 1, paginate: 15 }));
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditLicenseKey(params['id']))
                      .pipe(mergeMap(() => this.store.select(LicenseKeysState.selectedLicenseKey)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(licenseKey => {
        this.licenseKey = licenseKey;
        this.form.patchValue({
          license_key: this.licenseKey?.license_key,
          separator: this.licenseKey?.separator,
          product_id: this.licenseKey?.product_id,
          variation_id: this.licenseKey?.variation_id,
          status: this.licenseKey?.status
        });
      });

    this.search
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe((inputValue) => {
        this.store.dispatch(new GetProducts({ status: 1, is_approved: 1, paginate: 15, search: inputValue }));
        this.renderer.addClass(this.document.body, 'loader-none');
    });
  }

  productDropdown(event: Select2){
    if(event['innerSearchText']){
      this.search.next('');
    }
  }
  
  searchProduct(event: Select2SearchEvent){
    this.search.next(event.search);
  }

  updateProduct(data: Select2UpdateEvent) {
    if(data && data.options.length) {
      if(data.options[0].data) {
        this.form.controls['product_id'].setValue(data.options[0].data.product_id);
        this.form.controls['variation_id'].setValue(data.options[0].data.variation_id ? data.options[0].data.variation_id : null);
      }
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateLicenseKey(this.form.value);
    
    if(this.type == 'edit' && this.licenseKey?.id) {
      action = new UpdateLicenseKey(this.form.value, this.licenseKey.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/license-key'); 
        }
      });
    }
  }

}
