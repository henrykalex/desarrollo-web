import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { AdminComponent } from './admin/admin.component';

import { ProductsComponent } from '../shared/views/products/products.component';
import { ProductsRewardComponent } from '../shared/views/products-reward/products-reward.component';
import { ProductAddComponent } from './views/product-add/product-add.component';
import { ProductViewComponent } from '../shared/views/product-view/product-view.component';
import { OrdersRequestsComponent } from '../shared/views/orders-requests/orders-requests.component';
import { OrderNewComponent } from '../shared/views/order-new/order-new.component';
import { RequestNewComponent } from '../shared/views/request-new/request-new.component';
import { OrderRequestViewComponent } from '../shared/views/order-request-view/order-request-view.component';
import { UserModelsComponent } from '../shared/views/user-models/user-models.component';
import { UserModelAddComponent } from './views/user-model-add/user-model-add.component';
import { UserModelViewComponent } from '../shared/views/user-model-view/user-model-view.component';
import { StatsComponent } from '../shared/views/stats/stats.component';
import { LinkUserComponent } from '../shared/views/link-user/link-user.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        children: [
        { path: '',   redirectTo: 'distribuidores', pathMatch: 'full' },
        { path: 'distribuidores', component: UserModelsComponent, data: {type: 'distributor'} },
        { path: 'tiendas', component: UserModelsComponent, data: {type: 'veterinary'} },
        { path: 'clientes', component: UserModelsComponent, data: {type: 'client'} },

        { path: 'distribuidor', component: UserModelAddComponent, data: {type: 'distributor'} },
        { path: 'tienda', component: UserModelAddComponent, data: {type: 'veterinary'} },
        { path: 'cliente', component: UserModelAddComponent, data: {type: 'client'} },

        { path: 'distribuidor/:id', component: UserModelViewComponent, data: {type: 'distributor'} },
        { path: 'tienda/:id', component: UserModelViewComponent, data: {type: 'veterinary'} },
        { path: 'cliente/:id', component: UserModelViewComponent, data: {type: 'client'} },

        { path: 'escaner/distribuidores', component: LinkUserComponent, data: {type: 'distributor'} },
        { path: 'escaner/tiendas', component: LinkUserComponent, data: {type: 'veterinary'} },
        { path: 'escaner/clientes', component: LinkUserComponent, data: {type: 'client'} },

        { path: 'productos', component: ProductsComponent },
        { path: 'productos-recompensa', component: ProductsRewardComponent },
        { path: 'producto', component: ProductAddComponent, data: {reward: false} },
        { path: 'producto/reward', component: ProductAddComponent, data: {reward: true} },
        { path: 'producto/:id', component: ProductViewComponent },


        { path: 'pedidos', component: OrdersRequestsComponent, data: {type: 'request'} },
        { path: 'pedido', component: RequestNewComponent },
        { path: 'pedido/:id', component: OrderRequestViewComponent, data: {type: 'request'} },

        { path: 'estadisticas', component: StatsComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
