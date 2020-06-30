import { NavController } from '@ionic/angular';
import { Config } from 'src/providers/Config';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonHelper } from 'src/providers/helper';
import { Router, ActivatedRoute } from '@angular/router';
import { commonService } from '../../services/serviceFile';
import { validationService } from '../../services/validation.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public resetPassword: FormGroup;
  public data: any;
  enablePass = false;
  finalpass;
  constructor(
    public formBuilder: FormBuilder,
    public helper: CommonHelper,
    public router: Router,
    public nav: NavController,
    public route: ActivatedRoute,
    public Config: Config,
    public commonService: commonService,
    public validation: validationService,
  ) {
    this.data = this.Config.getConf("data");
    console.log('data', this.data);

  }

  ngOnInit() {
    this.resetPassword = this.formBuilder.group({
      //  new_password: new FormControl('', [Validators.pattern("[0-9]*"),Validators.required]),
      //  confirm_password: new FormControl('', [Validators.pattern("[0-9]*"),Validators.required]),
      num1: new FormControl("", [Validators.required]),
      num2: new FormControl("", [Validators.required]),
      num3: new FormControl("", [Validators.required]),
      num4: new FormControl(""),
      num5: new FormControl("", [Validators.required]),
      num6: new FormControl("", [Validators.required]),
      num7: new FormControl("", [Validators.required]),
      num8: new FormControl(""),
    });
  }
  moveFocus(event, nextElement, previousElement, final?) {
    this.enablePass = false;
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
      console.log("lkjflksdfl");
      let val = this.resetPassword.value['num8'].toString()
      if (val != '') {
      }
    }
    if (nextElement == "") {
      let num4 = event.path[0].value;
      if (num4 != '') {
        let finalpass = this.resetPassword.value['num1'].toString() + this.resetPassword.value['num2'].toString() + this.resetPassword.value['num3'].toString() + this.resetPassword.value['num4'].toString();
        var finaltest = this.checkWord(finalpass)
        if (!finaltest) {
          this.validation.presentToast("password should contains minimum one letter or special character")
        } else if(finaltest){
          this.enablePass = true;
        }
      }
    }
  }
  checkWord(word) {
    var numbers = word.match(/\d/g);
    var letters = word.match(/[a-zA-Z#?!@$%^&-]/g);
    return (numbers.length === 3 && letters.length === 1) || false;
  }
  update() {
    let newPass = this.resetPassword.value['num1'].toString() + this.resetPassword.value['num2'].toString() + this.resetPassword.value['num3'].toString() + this.resetPassword.value['num4'].toString();
    let cnPass = this.resetPassword.value['num5'].toString() + this.resetPassword.value['num6'].toString() + this.resetPassword.value['num7'].toString() + this.resetPassword.value['num8'].toString()
    if (newPass != cnPass) {
      return this.helper.toast('New Password & Confirm password should be same!!');
    } else {
      var finaltest = this.checkWord(newPass)
      if (!finaltest) {
        this.enablePass = false;
        this.validation.presentToast("password should contains minimum one lettel or special character")
        return true;
      } else if (finaltest) {
        this.enablePass = true;
      }
    }
    let obj = {
      password: cnPass,
      mobile_number: this.data.mobile_number
    }
    console.log(obj, 'objjjjjjjjjj')
    this.commonService.post('user/change-password', obj, false).subscribe((data: any) => {
      this.validation.dismissLoading()
      if (data.status) {
        this.helper.toast(data.message);
        this.router.navigate(['/login-pin']);
        this.helper.toast(data.message);
        this.validation.presentToast(data.message);
      } else {
        this.validation.presentToast(data.errorResponseDTO.errorMessage);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
}
