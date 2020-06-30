import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.css'],
})
export class AuthPage implements OnInit {

  constructor(public router: Router,
    public storage: Storage,
    ) { }

  ngOnInit() {
  }

  gotologin(){
    this.storage.get("userData").then(user => {
      console.log(user, "dfkjshdkfj")
      this.router.navigate(['/login-pin'])
    });
  }
  signInpage() {
    this.router.navigate(['/signup']);
  }
}
