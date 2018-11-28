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
      {name:'MI PERFIL',link:'/veterinario/perfil'},
      {name:'CLIENTES IRONDOG',link:'/veterinario/clientes'},
      {name:'ALMACENES IRONDOG',link:'/veterinario/distribuidores'},
      {name:'ÓRDENES A PROVEEDORES',link:'/veterinario/ordenes'},
      {name:'PRODUCTOS',link:'/veterinario/productos'},
      {name:'CANJEO DE PUNTOS',link:'/veterinario/productos-recompensa'},
      {name:'SOLICITUDES DE CLIENTES',link:'/veterinario/pedidos'},
      {name:'SALIR',link:'/veterinario/iniciar'}
    ];
    this.userName = this.authService.userName;
  }

  ngOnInit() {
  }

  goToProfile(){
    this.router.navigate(['veterinary','perfil']);
  }
}
