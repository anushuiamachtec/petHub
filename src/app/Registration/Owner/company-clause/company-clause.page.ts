import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { commonService } from '../../../services/serviceFile';
import { validationService } from '../../../services/validation.service';
import { Config } from '../../../../providers/Config';
declare var RazorpayCheckout: any;
import { Router, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { Events } from '@ionic/angular';
import { Chat } from 'src/providers/Chat'

@Component({
  selector: 'app-company-clause',
  templateUrl: './company-clause.page.html',
  styleUrls: ['./company-clause.page.scss'],
})
export class CompanyClausePage implements OnInit {
  options: any;
  isAccept: boolean = false
  deviceToken: any;
  response: any;
  public data: any = {};
  constructor(
    public alertController: AlertController,
    public nav: NavController,
    public events: Events,
    public Chat: Chat,
    public commonService: commonService,
    public validation: validationService,
    public Config: Config,
    public router: Router,
    public storage: Storage,

  ) {
    this.data = this.Config.getNav("data");
  }

  ngOnInit() {
    this.storage.get('fcmId').then((val) => {
      if (val) {
        this.deviceToken = val
      } else {
        this.deviceToken = ""
      }
    });
  }
  ionViewDidEnter() {
    if (this.data.isAccept != undefined) {
      this.isAccept = this.data.isAccept;
      this.options = this.data.options
    }
  }
  goBack() {
    this.data["options"] = this.options;
    this.data["isAccept"] = this.isAccept;
    this.Config.setNav("personal", this.data);
    console.log(this.data, "nav")
    this.nav.navigateBack(["./signup-next"])
  }
  isEmpty() {
    if (this.options == undefined) {
      this.validation.presentToast("Please select registraion methods")
      return true;
    } else if (!this.isAccept) {
      this.validation.presentToast("please Accept company clause.")
      return true;
    }
    console.log(this.data, "data")
    if (this.options != "adoption" && this.options != "buy") {
      this.sendPayIn()
    } else {
      this.SignUp("dumy Data")
    }
  }
  changeOption(data) {
    this.options = data;
  }
  SignUp(id?, price?, orgprice?, petOption?) {
    this.validation.presentLoading();
    if (id == "dumy Data") {
      this.data['payments'] = {};
      petOption = {
        petadoption: true

      }
      this.data['petoptions'] = petOption
    } else {
      let Payment = {
        transaction_id: id,
        price: price,
        orgprice: orgprice
      }
      this.data['payments'] = Payment;
      this.data['petoptions'] = petOption;
    }
    this.data["deviceType"] = this.validation.getDeviceType();
    this.data["deviceToken"] = this.deviceToken;
    this.commonService.post('user/signup/', this.data, false).subscribe((data: any) => {
      this.validation.dismissLoading()
      if (data.status) {
        localStorage.setItem("userloginforyouflip", "true");
        this.storage.set("token", data.token);
        this.Config.setConf("user", data.data.user);
        this.events.publish("connectSocket", data.data.user);
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        this.validation.setToken(data.data.token)
        this.validation.presentToast(data.message);
        this.router.navigate(['/home'])
      } else {
        this.validation.presentToast(data.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  sendPayIn() {
    var options = {
      "key": 'rzp_test_ZQGEWarIC5gpPs', // Enter the Key ID generated from the Dashboard
      "amount": 100000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
      "name": 'Karuppasamy',
      "prefill": {
        "name": 'Karuppasamy',
        "email": 'gksamygks96@gmail.com',
        "contact": '7200610847'
      },
      "notes": {
        "address": "note value"
      },
      "theme": {
        "color": "#161601"
      },

      "description": 'ShopApp 36.5',
      "image": 'https://kervetechtest.s3.ap-south-1.amazonaws.com/razerpay/1024+x+1024.png',
      "currency": 'INR',
      "modal": {
        ondismiss: function () {
        }
      }
    };

    var successCallback = (payment_id) => { // <- Here!
      let price, orgprice, petOption: any = {};
      if (this.options == "reg") {
        petOption.petregistration = true;
        price = 1000;
        orgprice = 100000;
      } else if (this.options == "buy") {
        petOption.puppybuy = true;
      } else if (this.options == "sale") {
        petOption.puppysale = true;
        price = 1000;
        orgprice = 100000;
      } else if (this.options == "adoption") {
        petOption.petadoption = true;
      }
      this.SignUp(payment_id, price, orgprice, petOption)
    };
    var cancelCallback = (error) => { // <- Here!
      this.validation.presentToast("Payment Failed")

    };
    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  navigateToLogin() {
    this.nav.navigateRoot(['login']);
  }

}