import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ForgotPassWord } from "../../../shared/action/auth.action";
import { SettingState } from '../../../shared/state/setting.state';
import { Values } from '../../../shared/interface/setting.interface';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {

  public form: FormGroup;
  public reCaptcha: boolean = true;

  @Select(SettingState.setting) setting$: Observable<Values>;

  constructor(private store: Store, 
    public router: Router, 
    public formBuilder: FormBuilder ) {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      recaptcha: ["", [Validators.required]]
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

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new ForgotPassWord(this.form.value)).subscribe({
        complete: () => { 
          this.router.navigateByUrl('/auth/otp'); 
        }     
      });
    }
  }
}
