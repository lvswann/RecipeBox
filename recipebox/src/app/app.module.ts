import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// import { AuthModule } from  './auth/auth.module';
import {AuthService} from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicStorageModule.forRoot(), IonicModule.forRoot(), AppRoutingModule,],
  // AuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, CookieService, AuthGuard, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
