import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isUserLogin = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    public storage: Storage,
    public navCtrl: NavController,
    private fcm: FCM,
    
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.checkNavigation();

      this.splashScreen.hide();
      this.fcm.getToken().then(token => {
        console.log("token", token);
        console.log("token", token);
        this.storage.set('fcmId', token)
      });

      this.storage.get('fcmId').then((val) => {
        let valuseset = (typeof (val))
        if (val) {
          return val;
        } else {
        }
      });
      this.fcm.onTokenRefresh().subscribe(token => {
      });
      this.fcm.onNotification().subscribe((data) => {
        // alert(JSON.stringify(data));
        if (data.wasTapped) {
          // alert('Received in background');
          this.router.navigate(['/Notifications'])
        } else {
          // alert('Received in foreground');
        }
      });
      this.fcm.subscribeToTopic('people');
      this.fcm.unsubscribeFromTopic('marketing');
    });

  }
  checkNavigation() {
    this.storage.get("userData").then(user => {
      if (user && user == null || user == undefined || user == "") {
          console.log("user11", user);
          this.navCtrl.navigateRoot(['/auth']);
      } else {
          console.log("user1122", user);
          this.navCtrl.navigateRoot(["/auth"]);
          console.log("connectSocket", user);
          localStorage.setItem("userData", JSON.stringify(user));
      }
  });
  }
}
