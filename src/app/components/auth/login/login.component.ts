import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Login } from '../../../shared/action/auth.action';
import { SettingState } from '../../../shared/state/setting.state';
import { Values } from '../../../shared/interface/setting.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public form: FormGroup;
  public reCaptcha: boolean = true;

  @Select(SettingState.setting) setting$: Observable<Values>;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      recaptcha: new FormControl(null, Validators.required),
    });
    this.setting$.subscribe(setting => {
      if((setting?.google_reCaptcha && !setting?.google_reCaptcha?.status) || !setting?.google_reCaptcha) {
        this.form.removeControl('recaptcha');
        this.reCaptcha = false;
      } else {
        this.form.setControl('recaptcha', new FormControl(null, Validators.required))
        this.reCaptcha = true;
      }
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new Login(this.form.value)).subscribe({
          complete: () => { 
            this.router.navigateByUrl('/dashboard'); 
          }     
        }
      );
    }
  }
  
}
