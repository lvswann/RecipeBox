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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, CommonModule, HttpClientModule, IonicStorageModule.forRoot(), IonicModule.forRoot(), AppRoutingModule,],
  // AuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, CookieService, AuthGuard, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}


// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule } from '@ionic/angular';
// import { FormsModule } from '@angular/forms';
// import { HomePage } from './home.page';
// import { HttpClientModule } from '@angular/common/http';

// import { HomePageRoutingModule } from './home-routing.module';
// import {ScrollingModule} from '@angular/cdk/scrolling';


// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     HomePageRoutingModule,
//     HttpClientModule,
//     ScrollingModule,
//   ],
//   declarations: [HomePage]
// })
// export class HomePageModule {}
