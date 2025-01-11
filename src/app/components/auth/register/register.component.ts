import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomValidators } from '../../../shared/validator/password-match';
import { StoreState } from '../../../shared/state/store.state';
import { CountryState } from '../../../shared/state/country.state';
import { StateState } from '../../../shared/state/state.state';
import { Stores } from '../../../shared/interface/store.interface';
import { CreateStore } from '../../../shared/action/store.action';
import { NotificationService } from '../../../shared/services/notification.service';
import { SettingState } from '../../../shared/state/setting.state';
import { Values } from '../../../shared/interface/setting.interface';
import * as data from '../../../shared/data/country-code';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public form: FormGroup;
  public codes = data.countryCodes;
  
  public reCaptcha: boolean = true;

  @Select(SettingState.setting) setting$: Observable<Values>;

  @Select(CountryState.countries) countries$: Observable<Select2Data>;
  @Select(StoreState.selectedStore) store$: Observable<Stores>;

  public states$: Observable<Select2Data>;

  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      store_name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      country_id: new FormControl('', [Validators.required]),
      state_id: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      country_code: new FormControl('91', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
      status: new FormControl(1),
      recaptcha: new FormControl(null, Validators.required)
    },{
      validator : CustomValidators.MatchValidator('password', 'password_confirmation')
    });

    this.setting$.subscribe(seting => {
       if((seting?.google_reCaptcha && !seting?.google_reCaptcha.status) || !seting?.google_reCaptcha) {
        this.form.removeControl('recaptcha');
        this.reCaptcha = false;
      } else {
        this.form.setControl('recaptcha', new FormControl(null, Validators.required))
        this.reCaptcha = true;
      }
    });
  }

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }

  countryChange(data: Select2UpdateEvent) {
    if(data && data?.value) {
      this.states$ = this.store
          .select(StateState.states)
          .pipe(map(filterFn => filterFn(+data?.value)));
      this.form.controls['state_id'].setValue('');
    } else {
      this.form.controls['state_id'].setValue('');
    }
  }

  submit() {
    this.form.markAllAsTouched();
    this.notificationService.notification = false;
    let action = new CreateStore(this.form.value);
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/login') 
        }
      });
    }
  }

}
