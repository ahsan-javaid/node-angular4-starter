import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: Object;
  errMsg: string;
  registerBtn: string;

  constructor(private authenticationService: AuthenticationService) {
    this.user = {};
    this.registerBtn = 'Register';
  }

  ngOnInit() {

  }

  onSubmit() {
    this.errMsg = '';
    this.registerBtn = 'Please Wait...';
    this.authenticationService.signup(this.user)
      .subscribe(
        res => {
          this.registerBtn = 'Register';
        },
        err => {
          this.errMsg = err.json().message;
          this.registerBtn = 'Register';
        }
      );
  }

}
