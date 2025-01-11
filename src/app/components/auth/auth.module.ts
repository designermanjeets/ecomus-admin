import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RecaptchaModule,
  RecaptchaFormsModule
} from 'ng-recaptcha';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';

// Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpComponent } from './otp/otp.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

// State
import { AuthState } from '../../shared/state/auth.state';
import { StoreState } from '../../shared/state/store.state';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    OtpComponent,
    UpdatePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SharedModule,
    NgxsModule.forFeature([AuthState, StoreState])
  ],
})
export class AuthModule { }
