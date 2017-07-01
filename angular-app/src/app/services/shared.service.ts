import { Injectable } from '@angular/core'
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class SharedService {
  user: any;
  constructor(private cookieService: CookieService) {
  }

  setUser(user: any) {
    this.user = user;
  }
  getUser() {
    return this.user;
  }
}

