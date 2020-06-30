import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google;

@Component({
  selector: 'app-auto-location',
  templateUrl: './auto-location.page.html',
  styleUrls: ['./auto-location.page.scss'],
})
export class AutoLocationPage implements OnInit {
  autocompleteItems;
  autocomplete;
  sendItem = { location: "", lat: "", lng: "", map_title: "" };
  service = new google.maps.places.AutocompleteService();
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  constructor(public viewCtrl: ModalController, private zone: NgZone,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, public navCtrl: NavController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
  ngOnInit() {
    // this.loadMap();
  }
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      let lat = resp.coords.latitude
      let long = resp.coords.longitude
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        lat = this.map.center.lat();
        long = this.map.center.lng();
        this.sendItem.lat = this.map.center.lat();
        this.sendItem.lng = this.map.center.lng();
        this.viewCtrl.dismiss(this.sendItem, "results");
      });
    }).catch((error) => {
    });
  }
 


  chooseItem(item: any) {
    this.geoCode(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        if (!predictions) return;
        predictions.forEach(function (prediction) {
          me.sendItem.map_title = prediction.structured_formatting.main_text;
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

  geoCode(address: any) {
    this.sendItem.location = address;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      this.sendItem.lat = results[0].geometry.location.lat();
      this.sendItem.lng = results[0].geometry.location.lng();
      this.viewCtrl.dismiss(this.sendItem, results);
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  pagePop() {
    this.navCtrl.pop();
  }
}
