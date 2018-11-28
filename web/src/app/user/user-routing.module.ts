import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { UserComponent } from './user/user.component';

import { ProfileComponent } from '../shared/views/profile/profile.component';
import { ProductsComponent } from '../shared/views/products/products.component';
import { ProductsRewardComponent } from '../shared/views/products-reward/products-reward.component';
import { ProductViewComponent } from '../shared/views/product-view/product-view.component';
import { OrdersRequestsComponent } from '../shared/views/orders-requests/orders-requests.component';
import { OrderNewComponent } from '../shared/views/order-new/order-new.component';
import { OrderRequestViewComponent } from '../shared/views/order-request-view/order-request-view.component';
import { UserModelsComponent } from '../shared/views/user-models/user-models.component';
import { UserModelViewComponent } from '../shared/views/user-model-view/user-model-view.component';
import { StatsComponent } from '../shared/views/stats/stats.component';
import { LinkUserComponent } from '../shared/views/link-user/link-user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        children: [
        { path: '',   redirectTo: 'veterinarios', pathMatch: 'full' },
        { path: 'veterinarios', component: UserModelsComponent, data: {type: 'veterinary'} },
        { path: 'ver/veterinario/:id', component: UserModelViewComponent, data: {type: 'veterinary'} },

        { path: 'ordenes', component: OrdersRequestsComponent, data: {type: 'order'} },
        { path: 'orden', component: OrderNewComponent },
        { path: 'orden/:id', component: OrderRequestViewComponent, data: {type: 'order'} },

        { path: 'productos', component: ProductsComponent },
        { path: 'productos-recompensa', component: ProductsRewardComponent },
        { path: 'producto/:id', component: ProductViewComponent },

        { path: 'estadisticas', component: StatsComponent },

        { path: 'escaner/veterinarios', component: LinkUserComponent, data: {type: 'veterinary'} },

        { path: 'perfil', component: UserModelViewComponent, data: {type: 'client'} },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
