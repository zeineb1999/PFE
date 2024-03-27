import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  nomPage: string='';
  constructor(private router: Router,private translate: TranslateService) {}

  ngOnInit() {
    const Page = this.router.url.split('/').pop() || 'dashboard';
    this.nomPage = Page;
    console.log('Nom de la page : ', Page);
  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }
}