import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../../auth/auth.service';

import { SideMenuBase } from '../../classes/SideMenuBase';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends SideMenuBase implements OnInit  {
  menuLinks: any[];
  userName: string;

  constructor(
    private router: Router, private authService: AuthService,
    protected media: MediaMatcher, protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(media,changeDetectorRef);
    this.menuLinks = [
      {name:'ALMACENES',link:'/admin/distribuidores'},
      {name:'TIENDAS',link:'/admin/tiendas'},
      {name:'CLIENTES',link:'/admin/clientes'},
      {name:'PRODUCTOS',link:'/admin/productos'},
      {name:'PRODUCTOS RECOMPENSA',link:'/admin/productos-recompensa'},
      {name:'SOLICITUDES DE CLIENTES',link:'/admin/pedidos'},
      {name:'SALIR',link:'/iniciar/master'}
    ];
    this.userName = this.authService.userName;
  }

  ngOnInit() {
  }

  goToProfile(){
    this.router.navigate(['admin','perfil']);
  }
}
