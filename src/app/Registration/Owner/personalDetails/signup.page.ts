import { Config } from '../../../../providers/Config';
import { CommonHelper } from 'src/providers/helper';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController, NavController } from "@ionic/angular";
import { commonService } from '../../../services/serviceFile';
import { validationService } from '../../../services/validation.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  
  email: any = "ii@gmail.com";
  signupForm: FormGroup;
  passwordType = "password";
  passwordIcon = "eye-off";
  passwordType1 = "password";
  passwordIcon1 = "eye-off";
  phonecode = "ISD";
  countries = [];
  enable_pass: boolean = true;
  enable_otp: boolean = true;
  enable_Timer: boolean = false;
  chekOTP: number
  viewVill = false;
  mailOtp = false;
  private interval: any;
  private dataObj: any = {}
  countryList = [];
  constructor(
    public router: Router,
    public helper: CommonHelper,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public nav: NavController,
    public Config: Config,
    public commonService: commonService,
    public validation: validationService,

  ) {
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      countryCode:new FormControl(""),
      name: new FormControl("", [Validators.pattern("[A-Z][a-z]*"),Validators.required]),
      email: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")]),
      mobile_number: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required, Validators.minLength(10), Validators.maxLength(15)]),
      otp: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      otp2: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      password: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required]),
      confirm_password: new FormControl("", [Validators.pattern("[0-9]*"), Validators.required]),
      secretanswer: new FormControl(""),
      secretquestion: new FormControl("")
    });
    this.countryList = this.validation.countryCode;

  }
  navigateToLogin() {
    this.nav.navigateRoot(["/login"]);
  }

  setfocus(id) {
    id.setFocus();
  }
  checkEmailOtp(otpdata){
    if(otpdata.value.length == 4){
      this.validation.presentLoading()
      let email = this.signupForm.controls['email'].value;
      this.commonService.get('user/verifyemailotp/'+ email + '/' + otpdata.value, {}, false).subscribe((data2: any) => {
        this.validation.dismissLoading()
        if (data2.status) {
          console.log(data2, "dfjdsfiudsfusdioiuf")
          this.mailOtp = false;
          this.validation.presentToast(data2.message);
        } else {
          this.mailOtp = true;
          this.validation.presentToast(data2.message);
        }
      }), err => {
        console.log(err, "err")
        this.validation.presentToast(err);
      };
    }
  }
  EmailOtp(data){
    console.log(data)
    if(data.includes('@')){
      this.validation.presentLoading()
      this.commonService.get('user/sendemailotp/' + data, {}, false).subscribe((data2: any) => {
        this.validation.dismissLoading()
        if (data2.status) {
          console.log(data2, "dfjdsfiudsfusdioiuf")
          this.mailOtp = true;
          this.validation.presentToast(data2.message);
        } else {
          this.mailOtp = false;
          this.validation.presentToast(data2.message);
        }
      }), err => {
        console.log(err, "err")
        this.validation.presentToast(err);
      };
    }
  }
  checkMobile() {
    let phone = this.signupForm.value.mobile_number.toString()
    const phoneNumber = parsePhoneNumberFromString('Phone:' +phone, this.signupForm.value.countryCode)
    let valid;
    if (phoneNumber) {
      valid = phoneNumber.isValid()
      if(!valid){
        this.signupForm.controls['mobile_number'].setValue('');
        this.validation.presentToast("please enter valid mobile number")
      }else {
        this.sendOtp();
      }
    }else {
      valid = false;
      this.signupForm.controls['mobile_number'].setValue('');
      this.validation.presentToast("please enter valid mobile number")
    }
  }
  ionViewDidEnter() {
    let data = this.Config.getNav("personal");
    //     let data  = {
    //       name: "fdgfdgfd",
    // email: "fdgfdgdf@gmail.com",
    // mobile_number: "4465464354",
    // otp: "3093",
    // password: "1234",
    // confirm_password: "1234",
    // from: "register"
    //     }
    if (data.name != null) {
      console.log("calling..", data)
      this.viewVill = true;
      this.dataObj = data;
      this.signupForm.controls['name'].setValue(data.name);
      this.signupForm.controls['email'].setValue(data.email);
      this.signupForm.controls['mobile_number'].setValue(data.mobile_number);
      this.signupForm.controls['otp'].setValue(data.otp);
      this.signupForm.controls['password'].setValue(data.password);
      this.signupForm.controls['confirm_password'].setValue(data.confirm_password);
      this.enable_pass = false;
      this.enable_otp = false;
      console.log("calling..", this.signupForm.value, "dfkjsdkjfds")
    }
  }
  sendOtp() {
    console.log("calling.......")
    let mobile_number = this.signupForm.controls['mobile_number'].value;
    // this.enable_pass = true;
    // this.enable_otp = true;
    if (mobile_number.length == 10) {
      this.validation.presentLoading();
      this.commonService.get('user/sendOtp/' + mobile_number, {}, false).subscribe((data: any) => {
        this.validation.dismissLoading()
        console.log("hdfsdkf", data)
        if (data.status) {
          this.SetTimer(mobile_number)
          this.enable_Timer = true;
          this.enable_otp = false;
          this.chekOTP = data.data.otp
          console.log(this.chekOTP, "dfjdsfiudsfusdioiuf")
          this.validation.presentToast(data.message);
        } else {
          this.validation.presentToast(data.message);
        }
      }), err => {
        console.log(err, "err")
        this.validation.presentToast(err);
      };
    } else if (mobile_number.length == 8 && mobile_number.length < 10) {
      // this.validation.presentToast("please enter valid mobile number");
    }
  }
  SetTimer(mobile_number) {
    var sec = 179;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      let x, y, z, w;
      x = document.getElementsByClassName("timer")[0] as HTMLElement;
      w = document.getElementsByClassName("expired-class")[0] as HTMLElement;
      // y = document.getElementsByClassName("timer2")[0] as HTMLElement
      z = document.getElementsByClassName("countdown")[0] as HTMLElement;
      // y.style.display = 'none';
      if (sec != 0 && mobile_number.length == 10) {
        // y.style.display = 'none';
        x.style.display = 'inline-block';
        w.style.display = 'block';
        z.style.display = 'inline-block';
        x.innerHTML = sec;
        sec--;
      } else {
        x.style.display = 'none';
        w.style.display = 'none';
        // y.style.display = 'block';
        z.style.display = 'none';
        clearInterval(this.interval);
      }
    }, 1000);

  }
  matchOtp() {
    let mobile_number = this.signupForm.controls['mobile_number'].value;
    let otp = this.signupForm.controls['otp'].value;
    let x = document.getElementsByClassName("timer")[0] as HTMLElement;
    let w = document.getElementsByClassName("expired-class")[0] as HTMLElement;
    // let y = document.getElementsByClassName("timer2")[0] as HTMLElement;
    let z = document.getElementsByClassName("countdown")[0] as HTMLElement;
    console.log(this.viewVill)
    if (this.viewVill) {
      console.log(this.viewVill)
      return true
    } else if (otp.toString().length == 4) {
      // this.validation.presentLoading();
      if (this.chekOTP == otp) {
        x.style.display = 'none';
        w.style.display = 'none';
        z.style.display = 'none';
        this.enable_Timer = false;
        this.enable_pass = false;
        clearInterval(this.interval);
      } else {
        this.validation.presentToast("OTP is wrong");

      }
      // this.commonService.get('user/validOtp/' + mobile_number + '/' + otp, {}, false).subscribe((data: any) => {
      //   // this.validation.dismissLoading()
      //   if (data.status) {
      //     this.validation.presentToast(data.message);
      //     x.style.display = 'none';
      //     w.style.display = 'none';
      //     z.style.display = 'none';
      //     this.enable_Timer = false;
      //     this.enable_pass = false;
      //     clearInterval(this.interval);
      //   } else {
      //     this.validation.presentToast(data.message);
      //   }
      // }), err => {
      //   console.log(err, "sdjflsdgkjhgkjs")
      //   this.validation.presentToast(err);
      //   x.style.display = 'none';
      //   w.style.display = 'none';
      //   z.style.display = 'none';
      //   this.enable_Timer = false;
      //   this.enable_pass = false;
      //   clearInterval(this.interval);
      // };
    }
  }

  register() {
    let val = this.signupForm.value;
    let custmErrMsg = {
      email: "Please enter a valid email address",
    };
    console.log("val", val);
    if (this.helper.setVaidations(this.signupForm, null, custmErrMsg)) {
      var numbers = /^[0-9]+$/;
      if (!val.password.match(numbers)) {
        this.validation.presentToast("password should only in numbers")
        return;

      } else if (!val.confirm_password.match(numbers)) {
        this.validation.presentToast("confirm password should only in numbers")
        return;

      } else if (val.password !== val.confirm_password) {
        this.helper.toast("Password and Confirm Password fields mis-matched!");
        return;
      } else {
        val['from'] = "register";
        if (this.dataObj.state != "") {
          val["streatName"] = this.dataObj.streatName;
          val["doorNumber"] = this.dataObj.doorNumber;
          val["area"] = this.dataObj.area;
          val["lat"] = this.dataObj.lat;
          val["lng"] = this.dataObj.lng;
          val["country"] = this.dataObj.country;
          val["state"] = this.dataObj.state;
          val["city"] = this.dataObj.city;
          val["zip_code"] = this.dataObj.zip_code;
        }
        if(this.dataObj.isAccept != undefined){
          val["isAccept"] = this.dataObj.isAccept;
          val["options"] = this.dataObj.options;
        }
        this.Config.setNav("data", val);
        this.nav.navigateForward(['signup-next']);
      }
    }
  }
  // facebookLogin() {
  //   this.helper.facebookLogin();
  // }
  hideShowPassword(i) {
    if (i === 0) {
      this.passwordType = this.passwordType === "text" ? "password" : "text";
      this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
    } else {
      this.passwordType1 = this.passwordType1 === "text" ? "password" : "text";
      this.passwordIcon1 = this.passwordIcon1 === "eye-off" ? "eye" : "eye-off";
    }
  }
  
  termsPage() {
    this.router.navigate(['/terms'])

  }
  ionViewWillEnter() {
    // this.signupForm.reset();
  }

}
