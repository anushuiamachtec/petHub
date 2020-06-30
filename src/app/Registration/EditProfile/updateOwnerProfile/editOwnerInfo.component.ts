import { CommonHelper } from 'src/providers/helper';
import { Storage } from '@ionic/storage';
import { HttpHeaders } from '@angular/common/http';
import { Config } from '../../../../providers/Config';
import { commonService } from '../../../services/serviceFile';
import { validationService } from '../../../services/validation.service'; import { MenuController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
declare var google;
@Component({
  selector: 'app-editOwnerInfo',
  templateUrl: 'editOwnerInfo.component.html',
  styleUrls: ['editOwnerInfo.component.css'],
})
export class editOwnerInfoPage implements OnInit {
  userData: any;
  allPets: any;
  autocompleteItems;
  autocomplete;
  passwordchange = false;
  sendItem = { location: "", lat: "", lng: "", map_title: "" };
  service = new google.maps.places.AutocompleteService();
  map: any;
  enable_pass: boolean = true;
  enable_otp: boolean = true;
  enable_Timer: boolean = false;
  chekOTP: number
  viewVill = false;
  hospitalObj:any = {};
  showhospitalList = false
  private interval: any;
  cityLists
  cityLists1
  hospitalList
  DocterList
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    // public commonService: commonService,
    public Config: Config,
    public menuCtrl: MenuController,
    public commonService: commonService,
    public validation: validationService,
    public viewCtrl: ModalController,
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.userData, "this.userData")
  }
  ngOnInit() {
    delete this.userData["password"];
    if(this.userData.contactdisplay){
      this.userData.contactdisplay = 'yes'
    }else{
      this.userData.contactdisplay = 'no'
    }
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getcities/' + this.userData.stateprefix + '/' + this.userData.state, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        this.cityLists = resdata.data;
        this.cityLists1 = resdata.data;
      } else {
      }
    }), err => {
      this.validation.presentToast(err);
    };
    console.log(this.userData)
  }
  openMenu() {
  }
  sendOtp() {
    let mobile_number = this.userData.mobile_number
    // this.enable_pass = true;
    // this.enable_otp = true;
    if (!this.enable_otp) {
      return true
    } else if (mobile_number.length == 10) {
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
      y = document.getElementsByClassName("timer2")[0] as HTMLElement
      z = document.getElementsByClassName("countdown")[0] as HTMLElement;
      y.style.display = 'none';
      if (sec != 0 && mobile_number.length == 10) {
        y.style.display = 'none';
        x.style.display = 'inline-block';
        w.style.display = 'block';
        z.style.display = 'inline-block';
        x.innerHTML = sec;
        sec--;
      } else {
        x.style.display = 'none';
        w.style.display = 'none';
        y.style.display = 'block';
        z.style.display = 'none';
        clearInterval(this.interval);
      }
    }, 1000);

  }
  matchOtp() {
    let otp = this.userData.otp;
    let x = document.getElementsByClassName("timer")[0] as HTMLElement;
    let w = document.getElementsByClassName("expired-class")[0] as HTMLElement;
    let y = document.getElementsByClassName("timer2")[0] as HTMLElement;
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
  changePassword(){
    console.log(this.userData.oldpass)
    if(this.userData.oldpass == localStorage.getItem('passToverify')){
      this.passwordchange = true;
    }else {
      this.passwordchange = false;
      this.validation.presentToast("Old password is not correct")
    }
  }
  EditAddress(val) {
    val['from'] = "edit";
    this.Config.setNav("data", val);
    this.navCtrl.navigateForward(['signup-next']);
  }
  updateProfile() {
    this.validation.presentLoading();
    if(this.userData.contactdisplay == 'yes'){
      this.userData.contactdisplay = true
    }else{
      this.userData.contactdisplay = false
    }
    if(this.userData.newpass!= undefined && this.userData.newpass.trim() !=""){
      if(this.userData.confirmpass!= undefined && this.userData.confirmpass.trim() !=""){
        if(this.userData.newpass == this.userData.confirmpass){
          this.userData.password =  this.userData.newpass
        }else {
          delete this.userData["password"]
        }
      }else {
        delete this.userData["password"]
      }
    }else {
      delete this.userData["password"]
    }
    if(this.hospitalObj.doctorname != undefined){
      this.userData.doctorlist.push(this.hospitalObj)
    }
    console.log(this.userData, "ussssssssss")
    this.commonService.put('user/update/' + this.userData.userId, this.userData, true).subscribe((data: any) => {
      this.validation.dismissLoading()
      if (data.status) {
        this.validation.presentToast(data.message);
        this.Config.setNav("UserUpdate", data.data);
        this.navCtrl.navigateBack(['home']);
        this.hospitalObj = {}
      } else {
        this.validation.presentToast(data.errorResponseDTO.errorMessage);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  medClicked(item) {
    this.hospitalObj.city = item;
    this.showhospitalList = false;
    let token = JSON.parse(this.validation.getToken())
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        this.commonService.get('doctor/gethosptial/' + this.hospitalObj.city, {}, { headers: headers }).subscribe((resdata: any) => {
          this.validation.dismissLoading();
          if (resdata.status) {
            this.hospitalList = resdata.data;
            console.log(this.hospitalList, "jjh")
          } else {
          }
        }), err => {
          this.validation.presentToast(err);
        };
  }
  searchCountry(event) {
    this.cityLists = []
    var q = event.target.value;
    this.hospitalObj.city = q;
    if (q != undefined) {
      if (q.trim() != '') {
        let result = this.cityLists1.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.cityLists = result
        this.showhospitalList = true;
        
      }
    }
  }
  getDocList(data){
    let result = this.hospitalList.filter(find => find.hospitalname.toUpperCase().includes(data.value.toUpperCase()));
    this.DocterList = result
  }
}
