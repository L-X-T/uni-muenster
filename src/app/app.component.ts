import { Component } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

import { authConfig } from './auth.config';

@Component({
  selector: 'app-flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Angular App :-)';

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
