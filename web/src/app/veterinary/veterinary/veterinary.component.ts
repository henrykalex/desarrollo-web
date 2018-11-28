import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../../auth/auth.service';

import { SideMenuBase } from '../../classes/SideMenuBase';

@Component({
  selector: 'app-veterinary',
  templateUrl: './veterinary.component.html',
  styleUrls: ['./veterinary.component.scss']
})
export class VeterinaryComponent extends SideMenuBase implements OnInit {
  menuLinks: any[];
  userName: string;

  constructor(
    private router: Router, private authService: AuthService,
    protected media: MediaMatcher, protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(media,changeDetectorRef);
    this.menuLinks = [
      {name:'MI PERFIL',link:'/tienda/perfil'},
      {name:'CLIENTES ',link:'/tienda/clientes'},
      {name:'ALMACENES ',link:'/tienda/distribuidores'},
      {name:'ÓRDENES A PROVEEDORES',link:'/tienda/ordenes'},
      {name:'PRODUCTOS',link:'/tienda/productos'},
      {name:'CANJEO DE PUNTOS',link:'/tienda/productos-recompensa'},
      {name:'SOLICITUDES DE CLIENTES',link:'/tienda/pedidos'},
      {name:'SALIR',link:'/tienda/iniciar'}
    ];
    this.userName = this.authService.userName;
  }

  ngOnInit() {
  }

  goToProfile(){
    this.router.navigate(['veterinary','perfil']);
  }
}
