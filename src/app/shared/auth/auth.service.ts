import { Injectable } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService) {}

  get userName(): string {
    let claims = this.oauthService.getIdentityClaims();
    return claims ? claims['given_name'] : null;
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }
}
