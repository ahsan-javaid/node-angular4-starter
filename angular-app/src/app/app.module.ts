import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import {SharedService} from './services/shared.service';
import {CookieService} from 'angular2-cookie/core';

import { AuthenticationService} from './services/auth.service';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([{
        path: 'home',
        component: HomeComponent,
      },
      {
        path:'signin',
        component:SigninComponent
      },
      {
        path:'signup',
        component:SignupComponent
      },
      { path: '',
        redirectTo: '/signin',
        pathMatch: 'full'
      },
    ])
  ],
  providers: [
    CookieService,
    AuthenticationService,
    SharedService,
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
