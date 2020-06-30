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
import { Sim } from "@ionic-native/sim/ngx";
import { Chat } from 'src/providers/Chat'

import {
  FormBuilder,
  FormControl,
  FormGroup,
  AbstractControl,
  Validators
} from "@angular/forms";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: "app-loginpin",
  templateUrl: "./login_pin.page.html",
  styleUrls: ["./login_pin.page.scss"]
})
export class LoginPinPage implements OnInit {
  public simInfo: any;
  public cards: any;
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
  Confirm = false;
  mobileNumber;
  finalpass;
  showCaptcha = false
  private captchaPassed: boolean = false;
  private captchaResponse: string;
  constructor(
    private sim: Sim,
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
    private fcm: FCM,
    public Chat: Chat,
    private zone: NgZone,
    public config: Config
  ) {
    this.fcm.getToken().then(token => {
      this.storage.set('fcmId', token)
      this.deviceToken = token;
    });
    this.getSimData()
  }
  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.simInfo = simData;
        this.cards = simData.cards;
        console.log(simData);
        if (this.cards.length > 1) {
          console.log("this.cards", this.cards.length)
          let simsArray = [];
          this.cards.forEach((key, val) => {
            let phno;
            if (key.phoneNumber.length > 10) {
              phno = key.phoneNumber.replace(/\D/g, '').slice(-10);
              console.log(this.mobileNumber)
            } else {
              phno = key.phoneNumber
            }
            simsArray.push(phno)
          })
          let JsonObj = {
            mobilenumbers: simsArray
          }
          this.commonService.post('user/checkmobilenumber', JsonObj, false).subscribe((data: any) => {
            this.validation.dismissLoading()
            if (data.status) {
              if (data.data.foundlenght == 1) {
                this.mobileNumber = data.data.foundval[0].mobile_number
                this.Confirm = false;
              } else if (data.data.foundlenght > 1) {
                this.Confirm = true;
              }
            } else {
              this.validation.presentToast(data.message);
            }
          }), err => {
            this.validation.presentToast(err);
          };
        } else {
          if (this.cards[0].phoneNumber.length > 10) {
            var s2 = this.cards[0].phoneNumber.replace(/\D/g, '').slice(-10);
            this.mobileNumber = s2;
            console.log(this.mobileNumber)
          } else {
            this.mobileNumber = this.cards[0].phoneNumber
          }
          this.Confirm = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  removedigits(data) {
    data = data.this.cards[0].phoneNumber.replace(/\D/g, '').slice(-10);
    return data
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
      userId: new FormControl("", [
        Validators.required,

      ]),
      num1: new FormControl("", [Validators.required]),
      num2: new FormControl("", [Validators.required]),
      num3: new FormControl("", [Validators.required]),
      num4: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required]),
    });
  }
  async moveFocus(event, nextElement, previousElement) {
    console.log(event.keyCode,"event.keyCode")
    this.showCaptcha = false;
    if (event.keyCode == 46){
      event.path[0].value = '';
    }else if (event.keyCode == 8 && previousElement) {
      if(event.path[0].value == ''){
        previousElement.setFocus();
      }else{
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
          this.validation.presentToast("password should contains minimum one letter or special character")
        } else if(finaltest){
          this.showCaptcha = true;
        }
      }
    }
  }
  confirmSim(data) {
    console.log(data, data.phoneNumber, "sjdhfjkshfkjsdhkjf")
    this.Confirm = false;
    if (data.phoneNumber.length > 10) {
      var s2 = data.phoneNumber.replace(/\D/g, '').slice(-10);
      this.mobileNumber = s2
    } else {
      this.mobileNumber = data.phoneNumber;
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
    console.log(word)
    var numbers = word.match(/\d/g);
    var letters = word.match(/[a-zA-Z#?!@$%^&-]/g);
    return (numbers.length === 3 && letters.length === 1) || false;
  }
  async login() {
    var finaltest = this.checkWord(this.finalpass)
    console.log(finaltest, "finaltest")
    if (!finaltest) {
      this.validation.presentToast("password should contains minimum one letter or special character")
    } else if (finaltest) {
      let userId = this.loginForm.value['userId'];
      this.validation.presentLoading()
      var FindKey = userId.includes("_");
      var numbers = /^[0-9]+$/;
      let json: any = {}
      localStorage.setItem('passToverify', this.finalpass)
      json = {
        "mobile_number": this.mobileNumber,
        "password": this.finalpass,
        "deviceType": this.validation.getDeviceType(),
        "deviceToken": this.deviceToken,
        "captchaResponse": this.captchaResponse
      }
      console.log(json, "logkin")
      this.commonService.post('user/signin', json, false).subscribe((data: any) => {
        this.validation.dismissLoading()
        if (data.status) {
          localStorage.setItem("userloginforyouflip", "true");
          this.storage.set("token", data.token);
          localStorage.setItem("userData", JSON.stringify(data.data.user));
          this.validation.setToken(data.data.token)
          this.config.setConf("user", data.data.user);
          this.events.publish("connectSocket", data.data.user);
          this.validation.presentToast(data.message);
          this.router.navigate(['/home'])
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
