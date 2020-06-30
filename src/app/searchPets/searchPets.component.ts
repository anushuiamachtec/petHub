import { CommonHelper } from 'src/providers/helper';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { commonService } from '../services/serviceFile';
import { validationService } from '../services/validation.service';
import { MenuController } from '@ionic/angular';
import { Config } from './../../providers/Config';
import { Router } from "@angular/router";
import { find } from 'rxjs/operators';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-searchPets',
  templateUrl: 'searchPets.component.html',
  styleUrls: ['searchPets.component.css'],
})
export class searchPetsPage implements OnInit {

  userData: any;
  allPets: any;
  countryList = false;
  stateList = false;
  cityList = false;
  home = true;
  pairPetList: any = [];;
  weightList = false;
  breadList = false;
  searchResults = false;
  searchObj: any = {};
  ownerPetList: any = [];
  allLists: any = [];
  categoryOrgArray = [
    "Dog",
    "Cat",
    "Goat",
    "Sheep",
    "Cow",
    "Buffalo",
    "Horse",
    "Hen",
    "Parrot"];
  breedsLists: any = [];
  breedsOrgLists: any = [];
  categoryArray: any = [];
    ownerLists: any = [];
  showcatList = false;
  showbreedList = false;
  countries: any = [];
  Orgcountries: any = [];
  showcountryList = false;
  states: any = [];
  Orgstates: any = [];
  showstateList = false;
  cities: any = [];
  Orgcities: any = [];
    IsMyMatches: boolean = true;
    favList:any = [];
  showcityList = false;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    public commonService: commonService,
    public validation: validationService,
    public menu: MenuController,
    public Config: Config,
    public router: Router,
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }
searchPets(){
  this.searchResults = false;
}

  searchCountry(data, data1) {
    this.categoryArray = []
    var q = data1;
    console.log(q)
    if (q != undefined) {
      if(q.trim() !=''){
      if (data == 'categoryName') {
        let result = this.categoryOrgArray.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.categoryArray=result
        this.showcatList = true;
      } else if (data == 'breedName') {
        let result = this.breedsOrgLists.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.breedsLists=result
        this.showbreedList = true;
      } else if (data == 'countryName') {
        let result = this.Orgcountries.filter(find => find.name.toUpperCase().includes(q.toUpperCase()));
        this.countries=result
        this.showcountryList = true;
      }else if (data == 'stateName') {
        let result = this.Orgstates.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.states=result
        console.log(result,this.states, "dskfjdksjf")
        this.showstateList = true;
      }else if (data == 'cityName') {
        let result = this.Orgcities.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.cities=result
        this.showstateList = true;
      }
    }
    } else {
      this.categoryArray = [];
    }

  }
  open1(){
  this.home = true;
  }
    open2(){
  this.home = false;
  }
  medClicked(data, item) {
    console.log(item)
    if (data == 'categoryName') {
      this.searchObj.categoryName = item;
      this.showcatList = false;
      this.changeLists();
    } else if (data == 'breedName') {
      this.searchObj.breedName = item;
      this.showbreedList = false;
    }else if (data == 'countryName') {
      this.searchObj.countryName = item.name;
      this.showcountryList = false;
      this.getState()
    }else if (data == 'stateName') {
      this.searchObj.stateName = item;
      this.showstateList = false;
      this.getCity()
    }else if (data == 'cityName') {
      this.searchObj.cityName = item;
      this.showcityList = false;
    }
    
  }
  ngOnInit() {
    let data1, data2
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let userId = this.userData.userId;
    this.commonService.get('pets/getownerspet/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        console.log(resdata, "resdata")
        this.ownerPetList = resdata.data;
        this.commonService.get('pets/getall', {}, { headers: headers }).subscribe((resdata2: any) => {
          this.validation.dismissLoading();
          if (resdata2.status) {
            console.log(resdata2, "resdata")
            this.allLists = resdata2.data;
            this.validation.presentToast(resdata2.message);
          } else {
            this.validation.presentToast(resdata2.message);
          }
        }), err => {
          this.validation.presentToast(err);
        };
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

    this.commonService.get('pets/getcounty', {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        this.Orgcountries = resdata.data;
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };


    this.commonService.get('pets/getcounty', {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        this.countries = resdata.data;
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }

  getState() {
    let shortForm = this.countries.find(data => data.name.trim() == this.searchObj.countryName.trim())
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getstate/' + shortForm.shortName, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        this.Orgstates = resdata.data;
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
    getFav(fav) {
    if (fav) {
      this.IsMyMatches = fav;
    } else {
      let userId = this.userData.userId;
      let token = JSON.parse(this.validation.getToken())
      this.IsMyMatches = false;
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
      this.commonService.get('pets/getpetfavlist/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
        this.validation.dismissLoading();
        if (resdata.status) {
          console.log(resdata, "resdata")
          this.favList = resdata.data;
          this.validation.presentToast(resdata.message);
        } else {
          this.validation.presentToast(resdata.message);
        }
      }), err => {
        this.validation.presentToast(err);
      };
    }
  }
  getCity() {

    let shortForm = this.countries.find(data => data.name.trim() == this.searchObj.countryName.trim())
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getcities/' + shortForm.shortName + '/' + this.searchObj.stateName, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
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
  changeLists() {
    let array = [];
    let data1, data2;
    this.pairPetList = [];
    console.log(this.searchObj, "caled.......")
    data1 = this.ownerPetList;
    data2 = this.allLists;
    this.breedsOrgLists = [];
    if (this.searchObj.categoryName == "Dog") {
      this.breedsOrgLists = this.validation.getDogBreeds();
    } else if (this.searchObj.categoryName == "Cat") {
      this.breedsOrgLists = this.validation.getCatBreeds();
    } else if (this.searchObj.categoryName == "Goat") {
      this.breedsOrgLists = this.validation.getGoatBreeds();
    } else if (this.searchObj.categoryName == "Sheep") {
      this.breedsOrgLists = this.validation.getSheepBreeds();
    } else if (this.searchObj.categoryName == "Cow") {
      this.breedsOrgLists = this.validation.getCowBreeds();
    } else if (this.searchObj.categoryName == "Buffalo") {
      this.breedsOrgLists = this.validation.getBuffaloBreeds();
    } else if (this.searchObj.categoryName == "Horse") {
      this.breedsOrgLists = this.validation.getHorseBreeds();
    } else if (this.searchObj.categoryName == "Hen") {
      this.breedsOrgLists = this.validation.getHenBreeds();
    } else if (this.searchObj.categoryName == "Parrot") {
      this.breedsOrgLists = this.validation.getParrotBreeds();
    }

    data2.forEach((o2, val2) => {
      if (this.userData.userId != o2.userId) {
        if (this.searchObj.categoryName == o2.category) {
          if (this.searchObj.gender == undefined && this.searchObj.breedName == undefined) {
            array.push(o2)
          } else if (this.searchObj.gender != undefined && this.searchObj.breedName == undefined) {
            if (this.searchObj.gender == o2.pet_gender) {
              if (this.compareLoc(o2) != false) {
                array.push(this.compareLoc(o2))
              } else {
                this.pairPetList = [];
              }
            }
          }
          else if (this.searchObj.gender == undefined && this.searchObj.breedName != undefined) {
            if (this.searchObj.breedName == o2.pet_breed) {
              if (this.compareLoc(o2) != false) {
                array.push(this.compareLoc(o2))
              } else {
                this.pairPetList = [];
              }
            }
          }
          else if (this.searchObj.gender != undefined && this.searchObj.breedName != undefined) {
            if (this.searchObj.breedName == o2.pet_breed && this.searchObj.gender == o2.pet_gender) {
              if (this.compareLoc(o2) != false) {
                array.push(this.compareLoc(o2))
              } else {
                this.pairPetList = [];
              }
            }
          }
        }
      }
    })
    Array.prototype.push.apply(this.pairPetList, array)
    console.log(this.pairPetList, "search")
  }
  compareLoc(o2) {
    let array = {}
    console.log(this.searchObj, "searchobj")
    if (this.searchObj.countryName == undefined) {
      array = o2
    } else {
      if (this.searchObj.countryName == o2.ownerdetails.address.country) {
        console.log(this.searchObj, o2)
        if (this.searchObj.stateName == undefined) {
          array = o2
        } else {
          if (this.searchObj.stateName == o2.ownerdetails.address.state) {
            if (this.searchObj.cityName == undefined) {
              array = o2
            } else {
              if (this.searchObj.cityName == o2.ownerdetails.address.city) {
                array = o2
              } else {
                this.validation.presentToast("No pets found in" + this.searchObj.cityName)
                return false;
              }
            }
          } else {
            this.validation.presentToast("No pets found in" + this.searchObj.stateName)
            return false;
          }
        }
      } else {
        this.validation.presentToast("No pets found in" + this.searchObj.countryName)
        return false;
      }
    }
    return array;
  }
  showMatches() {
    this.searchResults = true;
  }
  sendNotification(PetId) {
    this.userData.userId
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/viewed/' + PetId + '/' + this.userData.userId, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        console.log(resdata.data);
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  opencountry() {
    this.menu.open();
    this.countryList = true;
    this.stateList = false;
    this.cityList = false;
    this.weightList = false
    this.breadList = false;
    this.menu.open('first');
  }
  openstate() {
    this.menu.open();
    this.stateList = true;
    this.countryList = false
    this.cityList = false;
    this.weightList = false
    this.breadList = false;
    this.menu.open('first');
  }
  opencity() {
    this.menu.open();
    this.cityList = true;
    this.countryList = false
    this.stateList = false;
    this.weightList = false
    this.breadList = false;
    this.menu.open('first');
  }
  searchProfile() {
    this.pairPetList = [];
    let result = this.allLists.find(find => find.petId == this.searchObj.Id)
    console.log(this.searchObj, result, "jdshfkjdskjfsdkj")
    this.pairPetList.push(result);
    this.searchResults = true;
  }
  openWeight() {
    this.menu.open();
    this.weightList = true;
    this.countryList = false
    this.stateList = false;
    this.cityList = false
    this.breadList = false;
    this.menu.open('first');
  }
  openBread() {
    this.breadList = true;
    this.menu.open();
    this.countryList = false
    this.stateList = false;
    this.cityList = false
    this.weightList = false;
    this.menu.open('first');
  }
  backMenu() {
    this.searchResults = false;
  }
  AddFav(pet, fav) {
    let userId = JSON.parse(localStorage.getItem("userData"))['userId']
    let stringType;
    if (fav) {
      stringType = "favourite"
    } else {
      stringType = "unfavored"
    }
    let data = {
      "userId": userId,
      "petId": pet.petId,
      "favourite": fav,
      "favString": stringType
    }
    this.commonService.post('pets/favourite', data, true).subscribe((resdata: any) => {
      this.validation.dismissLoading()
      if (resdata.status) {
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.errorResponseDTO.errorMessage);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  viewProfile(data) {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getpet/' + data.petId, {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
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
