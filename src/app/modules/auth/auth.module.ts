import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';

import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyEmailComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    MatDividerModule,
    SocialLoginModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}

// //   {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider(
//               '893913805202-rg7o6somctq21ike6dk1u0d696t64e0q.apps.googleusercontent.com'
//             ),
//           },
//           {
//             id: FacebookLoginProvider.PROVIDER_ID,
//             provider: new FacebookLoginProvider('365586852354146'),
//           },
//         ],
//         onError: (err) => {
//           console.error(err);
//         },
//       } as SocialAuthServiceConfig,
//     },
