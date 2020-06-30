import { Config } from '../../../../../providers/Config';
import { CommonHelper } from '../../../../../providers/helper';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController, NavController, ActionSheetController } from "@ionic/angular";
import { commonService } from '../../../../services/serviceFile';
import { validationService } from '../../../../services/validation.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
declare var RazorpayCheckout: any;
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { File , FileEntry, IFile} from '@ionic-native/file/ngx';

@Component({
  selector: "app-uploadprofile",
  templateUrl: 'uploadProfile.html',
  styleUrls: ['uploadProfile.scss'],
})
export class uploadProfile implements OnInit {
  showReg = false;
  petDetails:any = {};
  imageArray:any = [];
  fileURLForUpload: string = "";
  photoTaken: any;
  display_image: any;
  cameraData: any;
  constructor(
    public router: Router,
    public helper: CommonHelper,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public nav: NavController,
    public Config: Config,
    public commonService: commonService,
    public validation: validationService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    public storage: Storage,
    public navCtrl: NavController,
  ) {
    this.petDetails = this.Config.getNav('petdetails')
    this.petDetails.petinfo = {}
  }
  ngOnInit() {
    console.log(this.petDetails)
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
      // if(fileInfo.type == undefined){
      //   alert("video")
      //   if (data) {
      //     this.showLoader();
      //     this.uploadedVideo = null;
      //     var filename = data.substr(data.lastIndexOf('/') + 1);
      //     var dirpath = data.substr(0, data.lastIndexOf('/') + 1);
      //     dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
      //     try {
      //       var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
      //       var retrievedFile = await this.file.getFile(dirUrl, filename, {});
      //     } catch (err) {
      //       this.validation.presentToast("Something went wrong.")
      //     }
      //     retrievedFile.file(data => {
      //       // let videoSize: number = parseInt(this.bytesConversion(data.size));
      //       // if (videoSize > 10) return this.validation.presentToast("You cannot upload more than 5mb.");
      //       this.selectedVideo = retrievedFile.nativeURL;
      //       this.uploadVideo()
      //     });
      //   }
      // }else{
        alert("image")
        this.fileURLForUpload = data
        this.uploadImage(dataType, type)
        this.photoTaken = true;
        this.display_image = 'data:image/jpg;base64,' + data;
        this.cameraData = data;
      // }
    }, (err) => {
      this.validation.presentToast("error in photo select");
    })
  }
  getDateTime(){
    var d = new Date();
			var m_names :any =["Jan", "Feb", "Mar", 
			"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
			"Oct", "Nov", "Dec"];

			var spl = d.toString().split(' ');
			var mnth = parseInt(m_names.indexOf(spl[1])+1).toString();
			mnth = (mnth.length == 1) ? '0'+mnth : mnth
			var myDateString = mnth+'/'+spl[2]+'/'+spl[3]
			var time = d.toLocaleTimeString();
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
    var d = new Date();
    var m_names :any =["Jan", "Feb", "Mar", 
    "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
    "Oct", "Nov", "Dec"];

    var spl = d.toString().split(' ');
    var mnth = parseInt(m_names.indexOf(spl[1])+1).toString();
    mnth = (mnth.length == 1) ? '0'+mnth : mnth
    var myDateString = mnth+'/'+spl[2]+'/'+spl[3]
    var time = d.toLocaleTimeString();
    var options = {
      fileKey: "files",
      fileName: "fileName.jpg",
      chunkedMode: false,
      date:myDateString,
      time: time,
      params: { userId: userId },
      headers: { 'Authorization': token },
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    // Use the FileTransfer to upload the image

    fileTransfer.upload(this.fileURLForUpload, url, options).then(data => {
      let jsonData = JSON.parse(data.response)

      this.validation.dismissLoading()
      if (jsonData && jsonData.status == true) {
        if ((dataType == 'image')) {
          Array.prototype.push.apply(this.imageArray, jsonData.data);
        }
      } else {
        this.validation.presentToast(jsonData.message);
      }
    }, err => {

    });
  }
  submit(){
    this.petDetails.petinfo['images'] = this.imageArray;
    alert('teststs')
    alert(JSON.stringify(this.petDetails))
  }
}