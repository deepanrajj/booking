import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import {AuthService} from './auth/services/auth.service';
import {Router} from '@angular/router';
import {Plugins, Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
