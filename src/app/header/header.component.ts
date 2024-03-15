import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  nomPage: string='';
  constructor(private router: Router) {}

  ngOnInit() {
    const Page = this.router.url.split('/').pop() || 'dashboard';
    this.nomPage = Page;
    console.log('Nom de la page : ', Page);
  }
}