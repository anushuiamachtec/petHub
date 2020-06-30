import { Config } from 'src/providers/Config';
import { CommonHelper } from 'src/providers/helper';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { commonService } from '../../services/serviceFile';
import { validationService } from '../../services/validation.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.page.html",
  styleUrls: ["./forget-password.page.scss"]
})
export class ForgetPasswordPage implements OnInit {
  forgetForm: FormGroup;
  IsMAil = false;
  isMobile = true;
  otpObj:any = {
    type: "mobilenumber"
  }
  userObj:any;
  showOtp = true;
  showAns = false;
  gonext = true;
  resend = false;
  countryList = [];

  constructor(
    public router: Router,
    public helper: CommonHelper,
    public formBuilder: FormBuilder,
    public Config: Config,
    public commonService: commonService,
    public validation: validationService,
  ) { }

  ngOnInit() {
    this.countryList = this.validation.countryCode;
    this.forgetForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")
      ]),
      mobilenumber: new FormControl("", [
        Validators.required,
      ]),
    });
  }
  ShowMail(data) {
    if (data == 'mail') {
      this.IsMAil = true;
      this.isMobile = false;
      this.forgetForm.reset();
    } else if (data == 'mobile') {
      this.isMobile = true;
      this.IsMAil = false;
      this.forgetForm.reset();
    }
  }
  otpType(data){
    this.otpObj= {}
    this.showAns = false;
    this.otpObj.type = data;
    console.log(this.otpObj)
  }
  sendOTP() {
    let json = {}
    if (this.otpObj.type == "mobilenumber") {
      json = {
        "type": "mobilenumber",
        "mobile_number": this.otpObj.number
      }
    } else if (this.otpObj.type == "email") {
      if(this.otpObj.email.includes('@')){
        json = {
          "type": "email",
          "email": this.otpObj.email
        }
      }else {
        this.validation.presentToast("please Enter Valid Email Address")
        return true
      }
    }
    this.commonService.post('user/forgot-password', json, false).subscribe((data: any) => {
      this.validation.dismissLoading()
      if (data.status) {
        this.userObj = data.data;
        console.log(this.userObj)
        this.showOtp = false;
        
         console.log(this.otpObj, "this.otpObj")
        // this.router.navigate(["/reset-password"]);
        this.validation.presentToast(data.message);
      } else {
        this.validation.presentToast(data.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
    
  }
  verifyOTP(data){
   let otp 
   if(data == 'mobile'){
    otp = this.otpObj.mobileOTP
   }else if (data == 'email'){
    otp = this.otpObj.emailOTP
   }
   if(otp == this.userObj.otp){
    if(this.otpObj.type == 'mobilenumber'){
      this.otpObj.secretQuestion = this.userObj.secretquestion
     }else if (this.otpObj.type == 'email'){
      this.otpObj.secretQuestion2 = this.userObj.secretquestion
     }
     this.showAns = true;
    this.validation.presentToast("OTP Verified")
   }else{
    this.otpObj.mobileOTP = "";
    this.otpObj.emailOTP = "";
    this.resend = true;
     this.validation.presentToast("Invalid OTP")
   }
   console.log(this.otpObj)
  }
  verifyANS(data){
    let ans 
    if(data == '1'){
     ans = this.otpObj.secretAns
    }else if (data == '2'){
     ans = this.otpObj.secretAns2
    }
    if(ans == this.userObj.secretanswer){
      this.gonext = false;
     this.validation.presentToast("Answer Verified")
    }else{
      this.otpObj.secretAns = "";
      this.otpObj.secretAns2 = "";
      this.validation.presentToast("Invalid Answer")
    }
    console.log(this.otpObj)
  }
  checkMobile() {
    let phone = this.otpObj.number.toString()
    const phoneNumber = parsePhoneNumberFromString('Phone:' +phone, this.otpObj.countryCode)
    let valid;
    if (phoneNumber) {
      valid = phoneNumber.isValid()
      if(!valid){
        this.otpObj.number = "";
        this.validation.presentToast("please enter valid mobile number")
      }else {
        this.sendOTP();
      }
    }else {
      valid = false;
      this.otpObj.number = "";
      this.validation.presentToast("please enter valid mobile number")
    }
  }
  goNext(){
    if(!this.gonext){
      this.Config.setConf("data", this.userObj);
      this.router.navigate(['/reset-password'])
    }
  }
  ionViewWillEnter() {
    this.forgetForm.reset();
  }
}
