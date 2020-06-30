import { CommonHelper } from 'src/providers/helper';
import { Storage } from "@ionic/storage";
import { IonInput } from "@ionic/angular";
import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { commonService } from '../../services/serviceFile';
import { validationService } from '../../services/validation.service';
import { Events } from '@ionic/angular';
import { Config } from 'src/providers/Config';
import { FCM } from '@ionic-native/fcm/ngx';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { Chat } from 'src/providers/Chat'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  AbstractControl,
  Validators
} from "@angular/forms";
import { DomSanitizer } from '@angular/platform-browser';
import { from } from 'rxjs';
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  timeout: any = false;
  backButtonPressedOnceToExit = false;
  loginForm: FormGroup;
  subscription: any;
  passwordType = "password";
  passwordIcon = "eye-off";
  url: any;
  lastTimeBackPress: any;
  timePeriodToExit = 2500;
  deviceToken: any;
  private captchaPassed: boolean = false;
  private captchaResponse: string;
  showCaptcha = false;
  finalpass;
  countryList = [];
  constructor(
    public Chat: Chat,
    public router: Router,
    public platform: Platform,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    private sanitize: DomSanitizer,
    public commonService: commonService,
    public validation: validationService,
    public events: Events,
    public config: Config,
    private fcm: FCM,
    private zone: NgZone,

  ) {
    this.fcm.getToken().then(token => {
      this.storage.set('fcmId', token)
      this.deviceToken = token;
    });
  }
  checkMobile() {
    let phone = this.loginForm.value.userId.toString()
    const phoneNumber = parsePhoneNumberFromString('Phone:' +phone, this.loginForm.value.countryCode)
    let valid;
    if (phoneNumber) {
      valid = phoneNumber.isValid()
      if(!valid){
        this.loginForm.controls['userId'].setValue('');
        this.validation.presentToast("please enter valid mobile number")
      }
    }else {
      valid = false;
      this.loginForm.controls['userId'].setValue('');
      this.validation.presentToast("please enter valid mobile number")
    }
  }
  ngOnInit() {
    
    this.storage.get('fcmId').then((val) => {
      if (val) {
        this.deviceToken = val
      } else {
        this.deviceToken = ""
      }
    });
    this.loginForm = this.formBuilder.group({
      countryCode: new FormControl("", [Validators.required]),
      userId: new FormControl("", [Validators.required]),
      num1: new FormControl("", [Validators.required]),
      num2: new FormControl("", [Validators.required]),
      num3: new FormControl("", [Validators.required]),
      num4: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required]),
    });
    this.countryList = this.validation.countryCode;
  }
  moveFocus(event, nextElement, previousElement, final?) {
    if (this.loginForm.value['userId'] == '') {
      event.path[0].value = "";
      this.validation.presentToast("Please Enter Mobile Number")
    } else if (this.loginForm.value['userId'].toString().length < 9) {
      event.path[0].value = "";
      this.validation.presentToast("Mobile number minlength shoube be 10")
    } else {
      if (event.keyCode == 8 && previousElement) {
        if (event.path[0].value == '') {
          previousElement.setFocus();
        } else {
          event.path[0].value = ''
        }
      } else if (event.path[0].value != '') {
        if (nextElement) {
          nextElement.setFocus();
        }
      }
      if (nextElement == "") {
        let num4 = event.path[0].value;
        if (num4 != '') {
          this.finalpass = this.loginForm.value['num1'].toString() + this.loginForm.value['num2'].toString() + this.loginForm.value['num3'].toString() + num4.toString();
          var finaltest = this.checkWord(this.finalpass)
          if (!finaltest) {
            this.captchaPassed = false;
            this.validation.presentToast("password should contains minimum one lettel or special character")
          } else if (finaltest) {
            this.showCaptcha = true;
          }
        }
      }
    }

  }
  captchaResolved(response) {
    console.log("res captchaResolved", response)
    this.zone.run(() => {
      this.captchaPassed = true;
      this.captchaResponse = response;
    });
  }
  checkWord(word) {
    var numbers = word.match(/\d/g);
    var letters = word.match(/[a-zA-Z#?!@$%^&-]/g);
    return (numbers.length === 3 && letters.length === 1) || false;
  }
  login() {
    var finaltest = this.checkWord(this.finalpass)
    console.log(finaltest, "finaltest")
    if (!finaltest) {
      this.validation.presentToast("password should contains minimum one lettel or special character")
    } else if (finaltest) {
      this.validation.presentLoading()
      let userId = this.loginForm.value['userId'];
      var FindKey = userId.includes("_");
      var numbers = /^[0-9]+$/;
      let json = {}

      if (!userId.match(numbers)) {
        json = {
          "userId": userId,
          "password": this.finalpass,
          "deviceType": this.validation.getDeviceType(),
          "deviceToken": this.deviceToken,
          "captchaResponse": this.captchaResponse
        }
      } else {
        json = {
          "mobile_number": userId,
          "password": this.finalpass,
          "deviceType": this.validation.getDeviceType(),
          "deviceToken": this.deviceToken,
          "captchaResponse": this.captchaResponse
        }
      }
      console.log(json, 'jsonjsonjson')
      localStorage.setItem('passToverify', this.finalpass)
      this.commonService.post('user/signin', json, false).subscribe((data: any) => {
        this.validation.dismissLoading()
        if (data.status) {
          localStorage.setItem("userloginforyouflip", "true");
          this.storage.set("token", data.token);
          localStorage.setItem("userData", JSON.stringify(data.data.user));
          this.storage.set("userData", data.data.user);
          this.config.setConf("user", data.data.user);
          this.events.publish("connectSocket", data.data.user);
          console.log(this.events, "evhgjhgg")
          this.validation.setToken(data.data.token)
          this.router.navigate(['/home'])
          this.validation.presentToast(data.message);
        } else {
          this.validation.presentToast(data.message);
        }
      }), err => {
        this.validation.presentToast(err);
      };
    }
  }
  // facebookLogin() {
  //   this.helper.facebookLogin();
  // }
  setfocus(id) {
    id.setFocus();
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if (this.router.url === "/login") {
        this.navCtrl.navigateRoot(['/login']);
        if (
          new Date().getTime() - this.lastTimeBackPress <
          this.timePeriodToExit
        ) {
          navigator["app"].exitApp(); // work for ionic 4
        } else {
          this.helper.toast("Press again to exit");
          this.lastTimeBackPress = new Date().getTime();
        }
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
  signInpage() {
    this.router.navigate(['/signup']);
  }
}
