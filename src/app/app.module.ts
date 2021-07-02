import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { OAuthModule } from 'angular-oauth2-oidc';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';

import { APP_ROUTES } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    // FormsModule,
    // FlightBookingModule,
    RouterModule.forRoot(APP_ROUTES, {
      // useHash: true
      // enableTracing: true,
      preloadingStrategy: PreloadAllModules
    }),
    OAuthModule.forRoot()
  ],
  declarations: [AppComponent, SidebarComponent, NavbarComponent, HomeComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
