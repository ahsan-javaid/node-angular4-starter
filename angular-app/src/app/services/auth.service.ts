import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import { SharedService } from './shared.service';

import 'rxjs/add/operator/map';
let headers = new Headers({'Content-Type': 'application/json'});
let options = new RequestOptions({headers: headers});

@Injectable()

export class AuthenticationService {
  constructor(private http: Http,private sharedService: SharedService, private cookieService: CookieService) {

  }
  signup(user: Object)  {
    return this.http.post('/api/v1/users/register', user, options)
      .map((response: Response) => {
        console.log(response.json());
        if (response.json().user) {
          this.cookieService.put('token', "Bearer " + response.json().user.token, {
            expires: moment().add(14, 'days').toDate()
          });
          this.sharedService.setUser(response.json().user);
        }
        return response.json();
      })
  }

}
