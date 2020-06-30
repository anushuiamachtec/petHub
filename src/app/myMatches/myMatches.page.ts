import { CommonHelper } from 'src/providers/helper';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { commonService } from '../services/serviceFile';
import { validationService } from '../services/validation.service';
import { MenuController } from '@ionic/angular';
import { Config } from './../../providers/Config';
import { Router } from "@angular/router";
import { FCM } from '@ionic-native/fcm/ngx';
import { Chat } from "src/providers/Chat";

// import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
//   SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
// declare var  swiper:any
@Component({
  selector: 'app-myMatches',
  templateUrl: 'myMatches.page.html',
  styleUrls: ['myMatches.page.scss'],
})
export class myMatchesPage implements OnInit {
  userData: any;
  allPets: any;
  pairPetList: any = [];
  AllPairs: any = [];
  ownerLists: any = [];
  favList: any;
  IsMyMatches: boolean = true;
  countries: any = [];
  states: any = [];
  cities: any = [];
  cscObj: any = {}
  selectedPet: any = {};
  totalNewLists = 0;
  public socket;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    public commonService: commonService,
    public validation: validationService,
    private menu: MenuController,
    public Config: Config,
    public router: Router,
    private fcm: FCM,
    private platform: Platform,
    public chat: Chat,

  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.socket = Chat.SocketObj;
    // this.platform.ready().then(() => {
      this.socket.on('totalnotification', (msg) => {
        console.log("totalnotification", msg, "mymateches")
        this.totalNewLists = msg
      });
    // })
  }
  getNotificationCount(str?) {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('notification/totalnewnotifications', {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.totalNewLists = resdata.data;
        console.log(this.totalNewLists, resdata.data,"saf")
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  goTochat(pairpet) {
    localStorage.setItem("MsgUser", JSON.stringify(pairpet));
    this.router.navigate(['/Message'])
  }
  ngOnInit() {
    console.log("calling1...............")
    this.pairPetList = [];
    let data1, data2;
    this.getNotificationCount()
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let userId = this.userData.userId;
    this.commonService.get('pets/getpetfavlist/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.favList = resdata.data;
      } else {
      }
    }), err => {
      this.validation.presentToast(err);
    };
    this.commonService.get('pets/getownerspet/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        data1 = resdata.data;
        this.ownerLists = resdata.data;
        if (!this.ownerLists.length) {
          // this.router.navigate(['/petRegistraion'])
        } else {
          this.commonService.get('pets/getall', {}, { headers: headers }).subscribe((resdata2: any) => {
            if (resdata2.status) {
              let findFav = resdata2.data;
              if (this.favList != undefined) {
                this.favList.forEach((key, val) => {
                  findFav.forEach((key1, val1) => {
                    if (key1.petId == key.petId && key1.userId == key.userId) {
                      key1["favouritestatus"] = key.favouritestatus;
                    }
                  })
                })
              }
              this.AllPairs = resdata2.data;
              data2 = resdata2.data;
              this.listMatches(data1, data2)
            } else {
              this.validation.presentToast(resdata2.message);
            }
          }), err => {
            this.validation.presentToast(err);
          };
        }
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

    this.commonService.get('pets/getcounty', {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.countries = resdata.data;
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

  }
  ionViewDidEnter() {
    console.log("calling...............")
    // this.ngOnInit();
  }
  getState() {
    let shortForm = this.countries.find(data => data.name.trim() == this.cscObj.countryName.trim())
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getstate/' + shortForm.shortName, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.states = resdata.data;
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  getCity() {
    let shortForm = this.countries.find(data => data.name.trim() == this.cscObj.countryName.trim())
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getcities/' + shortForm.shortName + '/' + this.cscObj.stateName, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.cities = resdata.data;
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  async listMatches(data1, data2, d3?) {
    this.pairPetList = [];
    let i;
    if (d3 == undefined) {
      i = 0
    } else {
      i = d3;
    }
    let o1 = data1[i];
    this.selectedPet = data1[i]
    data2.forEach((o2, val2) => {
      if (o1.userId != o2.userId) {
        this.pairPetList.push(o2)
      }
    })

  }
  changeLists(data, type) {
    if (data != undefined) {
      this.selectedPet = data;
    }
    let array = [];
    this.pairPetList = [];
    this.AllPairs.forEach((o2, val2) => {
      if (this.selectedPet.userId != o2.userId) {
        if (this.selectedPet.category == o2.category) {
          let gender;
          if (this.selectedPet.pet_gender == "Male") {
            gender = "Female"
          } else if (this.selectedPet.pet_gender == "Female") {
            gender = "Male"
          }
          if (gender == o2.pet_gender) {
            if (this.selectedPet.pet_breed == o2.pet_breed) {
              let country;
              if (type == 'image') {
                country = this.selectedPet.ownerdetails.address.country;
              } else {
                country = this.cscObj.countryName
              }
              if (country == o2.ownerdetails.address.country) {
                if (this.cscObj.stateName == undefined) {
                  array.push(o2)
                } else {
                  if (this.cscObj.stateName == o2.ownerdetails.address.state) {
                    if (this.cscObj.cityName == undefined) {
                      array.push(o2)
                    } else {
                      if (this.cscObj.cityName == o2.ownerdetails.address.city) {
                        array.push(o2)
                      }
                    }
                  }
                }

              }
            } else {
            }
          } else {
          }
        }
      }
    })
    Array.prototype.push.apply(this.pairPetList, array)
  }
  AddFav(pet, fav) {
    let userId = JSON.parse(localStorage.getItem("userData"))['userId']
    let stringType;
    console.log(fav)
    if (fav) {
      stringType = "favourite"
    } else if (!fav) {
      stringType = "unfavored"
    }
    let data = {
      "userId": userId,
      "petId": pet.petId,
      "favourite": fav,
      "favString": stringType
    }
    this.commonService.post('pets/favourite', data, true).subscribe((resdata: any) => {
      if (resdata.status) {
        this.favList = resdata.data;
        this.ionViewDidEnter();

      } else {
        this.validation.presentToast(resdata.errorResponseDTO.errorMessage);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }

  getFav(fav) {
    this.ngOnInit()
    if (fav) {
      this.IsMyMatches = fav;
    } else {
      let token = JSON.parse(this.validation.getToken())
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
      let userId = this.userData.userId;
      this.IsMyMatches = false;

      this.commonService.get('pets/getpetfavlist/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
        if (resdata.status) {
          this.favList = resdata.data;
        } else {
          this.validation.presentToast(resdata.message);
        }
      }), err => {
        this.validation.presentToast(err);
      };
    }
  }
  openFirst() {
    this.menu.enable(true, 'first');
    console.log(this.menu)
    this.menu.open('first');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  sendNotification(PetId) {

    // let token = JSON.parse(this.validation.getToken())
    // const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    // this.commonService.get('pets/viewed/' + PetId + '/' + this.userData.userId, {}, { headers: headers }).subscribe((resdata: any) => {
    //   this.validation.dismissLoading();
    //   if (resdata.status) {
    //     this.validation.presentToast(resdata.message);
    //   } else {
    //     this.validation.presentToast(resdata.message);
    //   }
    // }), err => {
    //   this.validation.presentToast(err);
    // };
  }
  openEnd() {
    this.menu.open('end');
  }
  logout() {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('user/logout/' + this.userData.mobile_number, {}, { headers: headers }).subscribe((data: any) => {
    })
    this.helper.toast("Logout successfull");
    this.navCtrl.navigateRoot(["/auth"]);
  }

  //GKCode

  openFirst1() {
    this.menu.open();

    this.menu.open('first');
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  sendIntrest(data) {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/interested/' + data.petId + '/' + this.userData.userId, {}, { headers: headers }).subscribe((resdata: any) => {
      console.log(resdata, "dgfhsdkf")
      if (resdata.status) {
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  callPetReg() {
    console.log("calling...........")
    this.router.navigate(['/petRegistraion'])
  }
  viewProfile(data) {
    console.log(data, this.pairPetList)
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getpet/' + data.petId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        console.log("pet", resdata.data)
        this.Config.setNav("pet", resdata.data);
        this.router.navigate(['/singleProfile'])
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

  }

}
