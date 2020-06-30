import { Config } from 'src/providers/Config';
import { Component, OnInit } from "@angular/core";
import { CommonHelper } from "src/providers/helper";
import { Storage } from "@ionic/storage";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.page.html",
  styleUrls: ["./verification.page.scss"]
})
export class VerificationPage implements OnInit {
  public otpData: any;
  public otpForm: FormGroup;
  public hidevalue = true;
  public maxTime: any = 30;
  public timer: any;
  public response: any;
  public data: any;
  public otpDataMerge: any;
  timeLeft: number;
  public txt1 = "";
  public txt2 = "";
  public txt3 = "";
  public txt4 = "";
  currentOtp: any;
  constructor(
    public helper: CommonHelper,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public Config:Config
  ) {
    console.log(this.route.snapshot);
    this.data=this.Config.getNav("data");
  }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      num1: new FormControl("", [Validators.required]),
      num2: new FormControl("", [Validators.required]),
      num3: new FormControl("", [Validators.required]),
      num4: new FormControl("", [Validators.required])
    });
  }

  otpPage(form: any, isValid: boolean) {
    let helper = this.helper;
    let customErrMsg={};
      if (helper.setVaidations(this.otpForm, null,customErrMsg)) {
         let otp = form.num1.toString() + form.num2.toString() + form.num3.toString() + form.num4.toString();
        if (Number(otp) === Number(this.data.otp)) {
          this.Config.setConf("data",this.data);
          this.router.navigate(["/reset-password"]);
        } else {
          this.helper.toast("Please enter a valid otp!");
        }
      }

  }
  Resend() {
    let that = this;
    let helper = this.helper;
    let obj={
      email:this.data.email
    }
    helper.httpRequest({url:"forgot-password",type:"POST",body:obj}).subscribe((res: any) => {
      if (res.status == true) {
        that.data = res.data;
        this.helper.toast(res.message);
      }
    });
  }
  moveFocus(event, nextElement, previousElement) {
    if (event.keyCode == 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = "";
    }
    if (nextElement == "") {
    }
  }
}
