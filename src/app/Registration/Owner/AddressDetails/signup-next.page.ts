import { Config } from '../../../../providers/Config';
import { AutoLocationPage } from '../../../auto-location/auto-location.page';
import { CommonHelper } from 'src/providers/helper';
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController, NavController } from "@ionic/angular";
declare var google;
import { commonService } from '../../../services/serviceFile';
import { validationService } from '../../../services/validation.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-signup-next',
  templateUrl: './signup-next.page.html',
  styleUrls: ['./signup-next.page.scss'],
})
export class SignupNextPage implements OnInit {
  @ViewChild('mapbooking', { static: true }) el: ElementRef;
  mapbooking: any;
  signupForm: FormGroup;
  public data: any = {};
  mapFocus;
  sendItem = { location: "", lat: "", lng: "", map_title: "" };
  public showmap: boolean = false;
  private countryList;
  statePrefix;
  constructor(
    public router: Router,
    public helper: CommonHelper,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public Config: Config,
    public nav: NavController,
    public commonService: commonService,
    public validation: validationService,
    private geolocation: Geolocation,
  ) {
    this.data = this.Config.getNav("data");
    console.log(this.data, "dsfdsfds")
  }
  goBack(){
    this.data["streatName"] = this.signupForm.value.streatName;
    this.data["doorNumber"] = this.signupForm.value.doorNumber;
    this.data["area"] = this.signupForm.value.area;
    this.data["lat"] = this.signupForm.value.lat;
    this.data["lng"] = this.signupForm.value.lng;
    this.data["country"] = this.signupForm.value.country;
    this.data["state"] = this.signupForm.value.state;
    this.data["city"] = this.signupForm.value.city;
    this.data["zip_code"] = this.signupForm.value.zip_code;
    this.Config.setNav("personal", this.data);
    console.log(this.data, "nav")
    this.nav.navigateBack(["./signup"])
  }
  ionViewDidEnter(){
    console.log(this.data)
    // let data = this.Config.getNav("personal");
    if(this.data.state != null){
      console.log("calling..", this.data)
      this.signupForm.controls['streatName'].setValue(this.data.streatName);
      this.signupForm.controls['doorNumber'].setValue(this.data.doorNumber);
      this.signupForm.controls['lng'].setValue(this.data.lng);
      this.signupForm.controls['area'].setValue(this.data.area);
      this.signupForm.controls['country'].setValue(this.data.country);
      this.signupForm.controls['state'].setValue(this.data.state);
      this.signupForm.controls['city'].setValue(this.data.city);
      this.signupForm.controls['zip_code'].setValue(this.data.zip_code);
      this.signupForm.controls['lat'].setValue(this.data.lat);
      this.signupForm.controls['lng'].setValue(this.data.lng);
      this.showmap = true;
      let latLng = new google.maps.LatLng(this.data.lat, this.data.lng);
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.mapbooking = new google.maps.Map(this.el.nativeElement, mapOptions);
      this.mapbooking.addListener('tilesloaded', () => {
        this.sendItem.lat = this.mapbooking.center.lat();
        this.sendItem.lng = this.mapbooking.center.lng();
        this.showmap = true;
        console.log(this.sendItem, "this.sendItem")
        if (this.sendItem) {
          setTimeout(() => {
            this.initMap(this.sendItem);
          }, 1000);
        }
      });
      console.log("calling..", this.signupForm.value, "dfkjsdkjfds")
    }
  }
  ngOnInit() {
    console.log(this.data, "this.datathis.data")
    this.signupForm = this.formBuilder.group({
      streatName: new FormControl("", [Validators.required]),
      doorNumber: new FormControl("", [Validators.required]),
      area: new FormControl("", [Validators.required]),
      lat: new FormControl("", [Validators.required]),
      lng: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      zip_code: new FormControl("", [Validators.required]),
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.mapbooking = new google.maps.Map(this.el.nativeElement, mapOptions);
      this.mapbooking.addListener('tilesloaded', () => {
        this.sendItem.lat = this.mapbooking.center.lat();
        this.sendItem.lng = this.mapbooking.center.lng();
        this.showmap = true;
        console.log(this.sendItem, "this.sendItem")
        if (this.sendItem) {
          setTimeout(() => {
            this.initMap(this.sendItem);
          }, 1000);
        }
      });
    }).catch((error) => {
    });
    this.commonService.get('pets/getcounty', {}).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        this.countryList = resdata.data;
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

  }

  getState() {
    let shortForm = this.countryList.find(data => data.name.trim() == this.signupForm.value.country.trim())
    this.statePrefix = shortForm.shortName;
  }
  initMap(myLatLng) {
    this.mapFocus = new google.maps.Map(document.getElementById('mapbooking'), {
      zoom: 10,
      center: myLatLng,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    });
    var image = {
      url: "assets/pin.png",
      scaledSize: new google.maps.Size(40, 40),
    };
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: this.mapFocus,
      title: 'Hello World!',
      icon: image,
      draggable: true,
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
      animation: google.maps.Animation.DROP,

    });
    google.maps.event.addListener(marker, 'dragend', () => {

      var mylatlng = { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() };
      this.codeLatLng(mylatlng);
    });
    this.codeLatLng(myLatLng);
  }
  async getLocation() {
    const modal = await this.modalCtrl.create({
      component: AutoLocationPage,
      componentProps: {},
    });
    modal.present();
    await modal.onDidDismiss().then((data: any) => {
      this.showmap = true;
      if (data.data) {
        setTimeout(() => {
          this.initMap(data.data);
        }, 1000);
      }
    });
  }

  getAddress(lat, lng, callback) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      }
    });
  }

  codeLatLng(loc) {
    var city;
    var region;
    var country;
    var zip_code;
    let that = this;
    var latlng = new google.maps.LatLng(loc.lat, loc.lng);
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        that.signupForm.controls['area'].setValue(results[0].formatted_address);
        that.signupForm.controls['lat'].setValue(loc.lat);
        that.signupForm.controls['lng'].setValue(loc.lng);
        if (results[1]) {
          var indice = 0;
          var indice2 = 0;
          for (var k = 0; k < results.length; k++) {
            if (results[k].types[0] == 'postal_code') {
              indice2 = j;
              break;
            }
          }
          if (results[k].address_components) {

            for (var ii = 0; ii < results[k].address_components.length; ii++) {
              if (results[k].address_components[ii].types[0] == "postal_code") {
                //this is the object you are looking for postal_code
                zip_code = results[k].address_components[ii];
              }
            }
          }
          for (var j = 0; j < results.length; j++) {
            if (results[j].types[0] == 'locality') {
              indice = j;
              break;
            }
          }
          if (results[j].address_components) {
            for (var i = 0; i < results[j].address_components.length; i++) {
              if (results[j].address_components[i].types[0] == "locality") {
                //this is the object you are looking for City
                city = results[j].address_components[i];
              }
              if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                //this is the object you are looking for State
                region = results[j].address_components[i];
              }
              if (results[j].address_components[i].types[0] == "country") {
                //this is the object you are looking for
                country = results[j].address_components[i];
              }

              if (results[j].address_components[i].types[0] == "administrative_area_level_2") {
                //this is the object you are looking for
              }
            }
          }
          //city data
          that.signupForm.controls['city'].setValue(city.long_name);
          that.signupForm.controls['state'].setValue(region.long_name);
          that.signupForm.controls['country'].setValue(country.long_name);
          that.signupForm.controls['zip_code'].setValue(zip_code.long_name);
          console.log(that.signupForm.value, "kjhkjhkhd")
          // alert(city.long_name + " || " + region.long_name + " || " + country.long_name)
        } else {
          that.helper.toast("No results found");
        }
        //}
      } else {
        that.helper.toast("Geocoder failed due to: " + status);
      }
    });
  }

  GoNext() {
    let form = this.signupForm.value;
    let custmErrMsg = {};
    console.log(this.data)
    if (this.helper.setVaidations(this.signupForm, null, custmErrMsg)) {
      this.data['area'] = form.area;
      this.data['lat'] = form.lat;
      this.data['lng'] = form.lng;
      this.data['country'] = form.country;
      this.getState();
      this.data['city'] = form.city;
      this.data['state'] = form.state;
      this.data['stateprefix'] = this.statePrefix;
      this.data['zip_code'] = form.zip_code;
      this.data['streatName'] = form.streatName;
      this.data['doorNumber'] = form.doorNumber;

      if(this.data.isAccept != undefined){
        this.data["isAccept"] = this.data.isAccept;
        this.data["options"] = this.data.options;
      }
      this.Config.setNav("data", this.data);
      console.log("val", this.data);
      if (this.data.from == "edit") {
        this.nav.navigateForward(['EditOwnerProfile']);
      } else if(this.data.from == "register") {
        this.nav.navigateForward(['companyClause']);
      }
    }
  }
  navigateToLogin() {
    this.nav.navigateRoot(['login']);
  }

}
