import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth-guard.service';

import { LoginComponent } from  './views/login/login.component';
// import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { RegisterComponent } from './views/register/register.component';
import { PrivacyComponent } from './views/privacy/privacy.component';

const routes: Routes = [
  { path: '',   redirectTo: 'perfil', pathMatch: 'full' },
  { path: 'iniciar', component: LoginComponent },
  { path: 'iniciar/:type', component: LoginComponent },
  // { path: 'olvido', component: ForgotPasswordComponent },
  // { path: 'olvido/:type', component: ForgotPasswordComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'registro/:type', component: RegisterComponent },
  { path: 'privacidad', component: PrivacyComponent },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'distribuidor',
    loadChildren: 'app/distributor/distributor.module#DistributorModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'veterinario',
    loadChildren: 'app/veterinary/veterinary.module#VeterinaryModule',
    canLoad: [AuthGuard]
  },
  {
    path: '',
    loadChildren: 'app/user/user.module#UserModule',
    canLoad: [AuthGuard]
  },
  { path: '**', redirectTo: '/perfil', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule { }
