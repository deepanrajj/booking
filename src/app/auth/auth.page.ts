import { Component, OnInit } from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.authService.login();
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Logging in...'
    }).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 2000);
    });
  }

  onSubmit(authForm: NgForm): void {
    console.log(authForm);
    const email = authForm.value.email;
    const password = authForm.value.password;
    console.log(email, password);
    if (this.isLogin) {
      // send request to login server
    } else {
      // send request to signup server
    }
  }

  onSwitchAuthMode(): void {
    this.isLogin = !this.isLogin;
  }
}
