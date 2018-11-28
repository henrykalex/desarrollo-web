import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../../auth/auth.service';

import { SideMenuBase } from '../../classes/SideMenuBase';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends SideMenuBase implements OnInit {
  menuLinks: any[];
  userName: string;

  constructor(
    private router: Router, private authService: AuthService,
    protected media: MediaMatcher, protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(media,changeDetectorRef);
    this.menuLinks = [
      {name:'MI PERFIL',link:'/perfil'},
      {name:'VETERINARIOS IRONDOG',link:'/veterinarios'},
      {name:'PRODUCTOS',link:'/productos'},
      {name:'CANJEO DE PUNTOS',link:'/productos-recompensa'},
      {name:'ÓRDENES A PROVEEDORES',link:'/ordenes'},
      {name:'SALIR',link:'/iniciar'}
    ];
    this.userName = this.authService.userName;
  }

  ngOnInit() {
  }

  goToProfile(){
    this.router.navigate(['perfil']);
  }

}
