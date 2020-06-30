import { CommonHelper } from 'src/providers/helper';
import { Storage } from '@ionic/storage';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { commonService } from '../services/serviceFile';
import { validationService } from '../services/validation.service';
import { MenuController } from '@ionic/angular';
import { Config } from './../../providers/Config';
import { Router } from "@angular/router";
import { ModalController, NavController, ActionSheetController } from "@ionic/angular";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File , FileEntry, IFile} from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
declare var RazorpayCheckout: any;
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userData: any;
  allPets: any;
  pairPetList: any = [];
  AllPairs: any = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  firstScreen = true;
  secondStep = false;
  ownerLists: any = [];
  favList: any;
  IsMyMatches: boolean = true;
  countries: any = [];
  states: any = [];
  cities: any = [];
  cscObj: any = {}
  selectedPet: any = {};
  fileURLForUpload: string = "";
  certificateArray: any = [];
  acheivementArray: any = [];
  imageArray: any = [];
  videoArray: any = [];
  fileURL: string = "../../assets/icon/boy.png"
  photoTaken: any;
  display_image: any;
  cameraData: any;
  breedsOrgLists: any = [];
  breedsLists: any = [];
  showbreedList = false
  petObj: any = {}
  selectedVideo: string;
  uploadedVideo: string;
  isUploading: boolean = false;
  uploadPercent: number = 0;
  videoFileUpload: FileTransferObject;
  loader;
  priceOfCountry: any;
  petsaleObj: any = {};
  petadoptionObj: any = {};
  ownersaleLists: any = [];
  owneradoptionLists: any = [];
  saleScreen = false;
  petRegscreen = true;
  adoptionScreen = false;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    public commonService: commonService,
    public validation: validationService,
    private menu: MenuController,
    public Config: Config,
    public router: Router,
    public camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    public actionSheetController: ActionSheetController,
    public events: Events,


  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }
  goTochat(pairpet) {
    localStorage.setItem("MsgUser", JSON.stringify(pairpet));
    this.router.navigate(['/Message'])
  }
  ngOnInit() {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let userId = this.userData.userId;
    this.commonService.get('pets/getownerspet/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.ownerLists = resdata.data;
        console.log(this.ownerLists, "jjh")
      } else {
      }
    }), err => {
      this.validation.presentToast(err);
    };
    this.commonService.get('petsale/getownerspetsale/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.ownersaleLists = resdata.data;
      } else {
      }
    }), err => {
      this.validation.presentToast(err);
    };
    this.commonService.get('petsadoption/getownerspetadopt/' + userId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.owneradoptionLists = resdata.data;
      } else {
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  screen(type) {
    if (type == 'sale') {
      this.saleScreen = true;
      this.petRegscreen = false;
      this.adoptionScreen = false
    } else if (type == 'adoption') {
      this.adoptionScreen = true
      this.petRegscreen = false;
      this.saleScreen = false
    } else {
      this.petRegscreen = true;
      this.saleScreen = false
      this.adoptionScreen = false
    }
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  editDetail(dats, type): void {
    localStorage.setItem('petId', dats.petId);
    localStorage.setItem('pettype', type);
    this.router.navigate(['/viewPetProfile']);
  }
  searchCountry(event, type) {
    this.breedsLists = []
    var q = event.target.value;
    if (type == 'sale') {
      this.petsaleObj.pet_breed = q;
    } else if (type == 'petreg') {
      this.petObj.pet_breed = q;
    } else if (type == 'adoption') {
      this.petadoptionObj.pet_breed = q;
    }
    if (q != undefined) {
      if (q.trim() != '') {
        let result = this.breedsOrgLists.filter(find => find.toUpperCase().includes(q.toUpperCase()));
        this.breedsLists = result
        this.showbreedList = true;
      }
    }
  }
  increase(data, type) {
    let count = parseInt(data)
    data = count + 1;
    if (type == 'male') {
      this.petsaleObj.maleCount = data;
      // this.petsaleObj.petFemaleCount = ""
    } else if (type == 'female') {
      this.petsaleObj.femaleCount = data
      // this.petsaleObj.petMaleCount = ""
    }
    this.petsaleObj.pet_gender = type
  }
  decrease(data, type) {
    let count = parseInt(data)
    if (count != 1) {
      data = count - 1;
    }
    if (type == 'male') {
      this.petsaleObj.maleCount = data;
      // this.petsaleObj.petFemaleCount = ""
    } else if (type == 'female') {
      this.petsaleObj.femaleCount = data;
      // this.petsaleObj.petMaleCount = ""
    }
    this.petsaleObj.pet_gender = type
  }
  medClicked(item, type) {
    if (type == 'sale') {
      this.petsaleObj.pet_breed = item;
    } else if (type == 'petreg') {
      this.petObj.pet_breed = item;
    } else if (type == 'adoption') {
      this.petadoptionObj.pet_breed = item;
    }
    this.showbreedList = false;
  }
  changeLists(event) {
    let category = event.target.value;
    this.breedsOrgLists = [];
    if (category == "Dog") {
      this.breedsOrgLists = this.validation.getDogBreeds();
    } else if (category == "Cat") {
      this.breedsOrgLists = this.validation.getCatBreeds();
    } else if (category == "Goat") {
      this.breedsOrgLists = this.validation.getGoatBreeds();
    } else if (category == "Sheep") {
      this.breedsOrgLists = this.validation.getSheepBreeds();
    } else if (category == "Cow") {
      this.breedsOrgLists = this.validation.getCowBreeds();
    } else if (category == "Buffalo") {
      this.breedsOrgLists = this.validation.getBuffaloBreeds();
    } else if (category == "Horse") {
      this.breedsOrgLists = this.validation.getHorseBreeds();
    } else if (category == "Hen") {
      this.breedsOrgLists = this.validation.getHenBreeds();
    } else if (category == "Parrot") {
      this.breedsOrgLists = this.validation.getParrotBreeds();
    }
  }
  nextScreen1() {
    this.firstScreen = false;
    this.secondStep = true
  }
  async selectImage(dataType, type) {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Gallery',
        handler: () => {
          this.selectProfile(this.camera.PictureSourceType.SAVEDPHOTOALBUM, dataType, type)
        }
      },
      {
        text: 'Take Image',
        handler: () => {
          this.selectProfile(this.camera.PictureSourceType.CAMERA, dataType, type)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  selectProfile(sourceType, dataType, type) {
    let options = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      correctOrientation: true,
      mediaType: this.camera.MediaType.ALLMEDIA,
      // allowEdit: true
    };
    const fileInfo:any = {};
    this.camera.getPicture(options).then(async (data) => {
      await this.file.resolveLocalFilesystemUrl(data).then((entry: FileEntry) => {
        return new Promise((resolve, reject) => {
          entry.file(meta => resolve(meta), error => reject(error));
        });
      }).then((meta: IFile) => {
        fileInfo.name = meta.name;
        fileInfo.type = meta.type; // This is a value compatible with the 'Content-Type' HTTP header
        fileInfo.size = meta.size;
        return fileInfo;
      }, err => {
        // alert(err)
      })
      if(fileInfo.type == undefined){
        alert("video")
        if (data) {
          this.showLoader();
          this.uploadedVideo = null;
          var filename = data.substr(data.lastIndexOf('/') + 1);
          var dirpath = data.substr(0, data.lastIndexOf('/') + 1);
          dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
          try {
            var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            var retrievedFile = await this.file.getFile(dirUrl, filename, {});
          } catch (err) {
            this.validation.presentToast("Something went wrong.")
          }
          retrievedFile.file(data => {
            // let videoSize: number = parseInt(this.bytesConversion(data.size));
            // if (videoSize > 10) return this.validation.presentToast("You cannot upload more than 5mb.");
            this.selectedVideo = retrievedFile.nativeURL;
            this.uploadVideo()
          });
        }
      }else{
        alert("image")
        this.fileURLForUpload = data
        this.uploadImage(dataType, type)
        this.photoTaken = true;
        this.display_image = 'data:image/jpg;base64,' + data;
        this.cameraData = data;
      }
    }, (err) => {
      this.validation.presentToast("error in photo select");
    })
  }
  public uploadImage(dataType, type) {
    this.validation.presentLoading();
    let url
    if (dataType == 'image' && type == 'sale') {
      url = this.commonService.url + "/petsale/imagefileupload";
    } else if (dataType == 'image' && type == 'petreg') {
      url = this.commonService.url + "/pets/imagefileupload";
    } else if (dataType == 'image' && type == 'adoption') {
      url = this.commonService.url + "/petsadoption/imagefileupload";
    }
    let token = JSON.parse(this.validation.getToken());
    let userId = JSON.parse(localStorage.getItem("userData"))['userId']

    var options = {
      fileKey: "files",
      fileName: "fileName.jpg",
      chunkedMode: false,
      params: { userId: userId },
      headers: { 'Authorization': token },
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    // Use the FileTransfer to upload the image

    fileTransfer.upload(this.fileURLForUpload, url, options).then(data => {
      let jsonData = JSON.parse(data.response)

      this.validation.dismissLoading()
      if (jsonData && jsonData.status == true) {
        if (dataType == 'achivement') {
          Array.prototype.push.apply(this.acheivementArray, jsonData.data);
        } else if ((dataType == 'certicatte')) {
          // this.certificateArray = jsonData.data
          Array.prototype.push.apply(this.certificateArray, jsonData.data);
        } else if ((dataType == 'image')) {
          // this.imageArray = jsonData.data
          Array.prototype.push.apply(this.imageArray, jsonData.data);
        } else if ((dataType == 'videos')) {
          // this.videoArray = jsonData.data
          Array.prototype.push.apply(this.videoArray, jsonData.data);
        }

      } else {
        this.validation.presentToast(jsonData.message);
      }
    }, err => {

    });
  }
  showLoader() {
    this.validation.presentToast("Please wait")
  }
  selectVideo() {
    const options: CameraOptions = {
      mediaType: this.camera.MediaType.VIDEO,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then(async (videoUrl) => {
        if (videoUrl) {
          this.showLoader();
          this.uploadedVideo = null;
          var filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
          var dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);
          alert(filename)
          alert(dirpath)
          dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
          try {
            var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            var retrievedFile = await this.file.getFile(dirUrl, filename, {});
          } catch (err) {
            this.validation.presentToast("Something went wrong.")
          }
          retrievedFile.file(data => {
            alert(data.type)
            let videoSize: number = parseInt(this.bytesConversion(data.size));
            if (videoSize > 10) return this.validation.presentToast("You cannot upload more than 5mb.");
            this.selectedVideo = retrievedFile.nativeURL;
            this.uploadVideo()
          });
        }
      }, (err) => {
      });
  }
  checkDigit(data, type) {
    console.log(data, type)
    if (type == 'petreg-year') {
      if (data.value.length == 1) {
        this.petObj.years = 0 + data.value
      }
    } else if (type == 'petreg-month') {
      if (data.value.length == 1) {
        this.petObj.month = 0 + data.value
      }
    } else if (type == 'petsale-year') {
      if (data.value.length == 1) {
        this.petsaleObj.years = 0 + data.value
      }
    } else if (type == 'petsale-month') {
      if (data.value.length == 1) {
        this.petsaleObj.month = 0 + data.value
      }
    } else if (type == 'petadoption-year') {
      if (data.value.length == 1) {
        this.petadoptionObj.years = 0 + data.value
      }
    } else if (type == 'petadoption-month') {
      if (data.value.length == 1) {
        this.petadoptionObj.month = 0 + data.value
      }
    }
  }
  bytesConversion(data) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(data, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }
  uploadVideo() {
    var url = this.commonService.url + "/pets/imagefileupload";
    let token = JSON.parse(this.validation.getToken());
    let userId = JSON.parse(localStorage.getItem("userData"))['userId']
    var filename = this.selectedVideo.substr(this.selectedVideo.lastIndexOf('/') + 1);
    alert(this.selectedVideo);
    var options: FileUploadOptions = {
      fileName: filename,
      fileKey: "files",
      mimeType: "video/mp4",
      chunkedMode: false,
      params: { userId: userId },
      headers: { 'Authorization': token },
    }
    this.videoFileUpload = this.transfer.create();
    this.isUploading = true;
    console.log(this.selectedVideo, url, options)
    this.videoFileUpload.upload(this.selectedVideo, url, options).then((data) => {
      this.isUploading = false;
      let updatePercent = document.getElementById("Percent") as HTMLElement
      updatePercent.style.display = "none"
      this.uploadPercent = 0;
      console.log(data, "data1")
      return JSON.parse(data.response);
    }).then((data) => {
      console.log(data, "data2")

      // this.uploadedVideo = data.url;
      this.isUploading = false;
      // this.videoArray.push(data.url)
      // Array.prototype.push.apply(this.videoArray, data.data);
      Array.prototype.push.apply(this.imageArray, data.data);
      this.validation.presentToast("Video upload was successful.")
    }).catch((err) => {
      console.log(err, "data2")
      this.isUploading = false;
      this.uploadPercent = 0;
      let updatePercent = document.getElementById("Percent") as HTMLElement
      updatePercent.innerHTML = this.uploadPercent.toString();
      updatePercent.style.display = "none"
      this.validation.presentToast("Error uploading video.")
    });
    this.videoFileUpload.onProgress((data) => {
      this.isUploading = true;
      this.uploadPercent = Math.round((data.loaded / data.total) * 100);
      let updatePercent = document.getElementById("Percent") as HTMLElement
      updatePercent.innerHTML = this.uploadPercent.toString();
    });
  }
  genderType(type) {
    this.petsaleObj.pet_gender = type
  }
  checkValidation(type, id) {
    let obj;
    if (type == 'sale') {
      obj = this.petsaleObj;
    } else if (type == 'adoption') {
      obj = this.petadoptionObj;
    } else if (type == 'petreg') {
      obj = this.petObj;
    }
    if (obj.category == undefined) {
      this.validation.presentToast("Please Select Pet Category")
      return true
    } else if (obj.pet_breed == undefined) {
      this.validation.presentToast("Please Select Pet Breed")
      return true
    } else if (obj.years == undefined) {
      this.validation.presentToast("Please Enter Pet Age")
      return true
    } else if (obj.years.trim() == "") {
      this.validation.presentToast("Please Enter Pet Age")
      return true
    }
    if (type == 'sale') {
      if (obj.maleCount == undefined && obj.femaleCount == undefined) {
        this.validation.presentToast("Please Enter Pet Count")
        return true
      } else if (obj.maleCount.trim() == "" && obj.femaleCount.trim() == "") {
        this.validation.presentToast("Please Enter Pet Count")
        return true
      } else if (!this.imageArray.length) {
        this.validation.presentToast("Please Upload Pet Image")
        return true
      }
    }
    if (type == 'petreg' || type == 'adoption') {
      if (obj.pet_name == undefined) {
        this.validation.presentToast("Please Enter Pet Name")
        return true
      } else if (obj.pet_name.trim() == "") {
        this.validation.presentToast("Please Enter Pet Name")
        return true
      } else if (obj.pet_gender == undefined) {
        this.validation.presentToast("Please Select Pet Gender")
        return true
      } else if (!this.imageArray.length) {
        this.validation.presentToast("Please Upload Pet Image")
        return true
      }
    }
    this.callSubmit(type, id)
  }
  callSubmit(type, id) {
    let firstPet = false;
    if (!this.ownerLists.length && !this.ownersaleLists.length) {
      firstPet = true;
    }
    if (type == 'sale') {
      this.petsaleObj.images = this.imageArray
      this.petsaleObj.firstPet = firstPet;
      this.petsaleObj.pet_age = this.petsaleObj.years + ' ' + 'Years and ' + ' ' + this.petsaleObj.month + ' ' + 'months'
    } else if (type == 'adoption') {
      firstPet = false;
      this.petadoptionObj.images = this.imageArray;
      this.petadoptionObj.firstPet = firstPet;
      this.petadoptionObj.pet_age = this.petadoptionObj.years + ' ' + 'Years and ' + ' ' + this.petadoptionObj.month + ' ' + 'months'
    } else {
      this.petObj.images = this.imageArray;
      this.petObj.firstPet = firstPet;
      this.petObj.pet_age = this.petObj.years + ' ' + 'Years and ' + ' ' + this.petObj.month + ' ' + 'months'
    }
    // this.sendPayIn(type)
    console.log(this.userData.lifetimemember, firstPet, type, "paymentissu")
    // if (!this.userData.lifetimemember && type == 'adoption') {
    // } else if (this.userData.lifetimemember && !firstPet && type != 'adoption') {
    //   this.sendPayIn(type)
    // } else if (type == 'adoption') {
    //   this.petObj.payments = {}
    //   this.postData(type)
    // }
    if (type == 'adoption') {
      this.petObj.payments = {}
      this.postData(type)
    } else if (!this.userData.lifetimemember) {
      this.sendPayIn(type)
    } else if (this.userData.lifetimemember && firstPet) {
      this.postData(type)
    } else if (this.userData.lifetimemember && !firstPet) {
      this.sendPayIn(type)
    }
    document.getElementById(id).style.display = "none";
  }
  sendPayIn(type) {
    let amount;
    if (!this.userData.lifetimemember) {
      amount = 100000
    } else {
      amount = 30000
    }
    var options = {
      "key": 'rzp_test_ZQGEWarIC5gpPs', // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
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
      this.postData(type, payment_id)
    };
    var cancelCallback = (error) => { // <- Here!
      this.validation.presentToast("Payment Failed")

    };
    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  postData(type, id?) {
    let amount, orgamount;
    if (!this.userData.lifetimemember) {
      amount = 100000;
      orgamount = 1000
    } else {
      amount = 30000;
      orgamount = 300
    }
    let json, url;
    if (type == 'sale') {
      if (id) {
        this.petsaleObj.payments = {
          "transaction_id": id,
          "price": amount,
          "orgprice": orgamount
        }
      }
      url = 'petsale/add'
      json = this.petsaleObj
    } else if (type == 'adoption') {
      this.petadoptionObj.payments = {
      }
      url = 'petsadoption/add'
      json = this.petadoptionObj

    }
    else {
      if (id) {
        this.petObj.payments = {
          "transaction_id": id,
          "price": amount,
          "orgprice": orgamount
        }
      }
      url = 'pets/add'
      json = this.petObj
    }
    this.validation.presentLoading();
    this.commonService.post(url, json, true).subscribe((resdata: any) => {
      this.ngOnInit()
      this.validation.dismissLoading()
      if (resdata.status) {
        this.validation.presentToast(resdata.message);
        this.imageArray = []
        this.petObj = {}
        this.petsaleObj = {}
        this.petadoptionObj = {}
        if (!this.userData.lifetimemember) {
          this.userData.lifetimemember = true;
        }
      } else {
        this.validation.presentToast(resdata.errorResponseDTO.errorMessage);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  logout() {
    this.validation.presentLoading()
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('user/logout/' + this.userData.mobile_number, {}, { headers: headers }).subscribe((data: any) => {
      this.validation.dismissLoading()
      this.helper.toast("Logout successfull");
      this.navCtrl.navigateRoot(["/auth"]);
      localStorage.clear();
      this.storage.clear();
      this.events.publish("disconnectSocket");
    })
  }
}
