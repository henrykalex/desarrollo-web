import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import { AuthService } from './auth/auth.service';
import { WindowRefService } from './services/window-ref.service';
import { PrivacyComponent } from './views/privacy/privacy.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC_y531baB33CnXvAZULMOTjb9n37Yg1EU'
      // apiKey: 'AIzaSyCs2M6E2x_Bp1hC2m0zGOcthZyLWtTxl8w'//testing
    }),
  ],
  providers: [
    AuthService,
    WindowRefService,
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
