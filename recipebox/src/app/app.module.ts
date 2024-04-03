import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from  './auth/auth.module';
import {AuthService} from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';


import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicStorageModule.forRoot(), IonicModule.forRoot(), AppRoutingModule, AuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
