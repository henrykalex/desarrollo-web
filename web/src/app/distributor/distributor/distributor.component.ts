import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../../auth/auth.service';

import { SideMenuBase } from '../../classes/SideMenuBase';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.scss']
})
export class DistributorComponent extends SideMenuBase implements OnInit {
  menuLinks: any[];
  userName: string;

  constructor(
    private router: Router, private authService: AuthService,
    protected media: MediaMatcher, protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(media,changeDetectorRef);
    this.menuLinks = [
      {name:'MI PERFIL',link:'/distribuidor/perfil'},
      {name:'VETERINARIOS IRONDOG',link:'/distribuidor/veterinarios'},
      {name:'ÓRDENES A PROVEEDORES',link:'/distribuidor/ordenes'},
      {name:'PRODUCTOS',link:'/distribuidor/productos'},
      {name:'CANJEO DE PUNTOS',link:'/distribuidor/productos-recompensa'},
      {name:'SOLICITUDES DE CLIENTES',link:'/distribuidor/pedidos'},
      {name:'SALIR',link:'/distribuidor/iniciar'}
    ];
    this.userName = this.authService.userName;
  }

  ngOnInit() {
  }

  goToProfile(){
    this.router.navigate(['distributor','perfil']);
  }
}
