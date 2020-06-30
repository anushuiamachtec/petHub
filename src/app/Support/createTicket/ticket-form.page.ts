import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { validationService } from '../../services/validation.service';
import { commonService } from '../../services/serviceFile';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.page.html',
  styleUrls: ['./ticket-form.page.scss'],
})
export class TicketFormPage implements OnInit {

  ticket_code: any = '';
  ticket_id: any = '';
  topicObj: any = {};
  user_id: any = '';
  topic_name: any = '';
  exp_date: any = '';
  created_date: any = '';
  updated_date: any = '';
  assign_id: any = '';
  status: any = '';
  code: any = '';
  argument: any = [];
  topic_detail: any = [];
  subject: string = '';
  description: string = '';
  priority: string = '';
  priority_string = '';
  response;
  topicName:string = '';
  print_jsondata: any = '';
  my_url: any = 'string';
  fileURLForUpload: string = "";
  fileName: any = [];
  userData;
  descriptionArray = [];
  constructor(
    private commonService: commonService,
    private validation: validationService,
    private navController: NavController,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public platform: Platform,
    public routerOutlet: IonRouterOutlet,
    // private file: File,
    // private webview: WebView,
    // private filePath: FilePath,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer
  ) {
    this.ticket_code = this.activatedRoute.snapshot.paramMap.get('id');
    this.get_topic();
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  ngOnInit() {
    console.log(this.userData, "this.userData")
    if (this.ticket_code == null) {
    }
    else {
      this.get_single_ticket_detail();
    }
  }


  backmenu(){
    this.router.navigateByUrl('/Support')
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

    alert(JSON.stringify(this.camera.MediaType))
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

    this.camera.getPicture(options).then(async (data) => {
      // this.fileURL =this.webView.convertFileSrc(data)
      // var filename = data.substr(data.lastIndexOf('/') + 1);
      // var dirpath = data.substr(0, data.lastIndexOf('/') + 1);
      // alert(filename)
      // alert(dirpath)
      // alert(JSON.stringify(data))
      // dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
      // try {
      //   var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
      //   var retrievedFile = await this.file.getFile(dirUrl, filename, {});
      // } catch (err) {
      //   this.validation.presentToast("Something went wrong.")
      // }
      // retrievedFile.file(data => {
      //   alert("alert")
      //   alert(data.type)
      //   alert("type")
      //   let videoSize: number = parseInt(this.bytesConversion(data.size));
      //   if (videoSize > 10) return this.validation.presentToast("You cannot upload more than 5mb.");
      //   this.selectedVideo = retrievedFile.nativeURL;
      //   this.uploadVideo()
      // });
      this.fileURLForUpload = data
      alert(JSON.stringify(data))
      this.uploadImage(dataType, type)
      // this.photoTaken = true;
      // this.display_image = 'data:image/jpg;base64,' + data;
      // this.cam/eraData = data;
    }, (err) => {
      this.validation.presentToast("error in photo select");
    })
  }
  public uploadImage(dataType, type) {
    this.validation.presentLoading();
    // Destination URL
    let url = this.commonService.url + '/ticket/uploadticket'
    let token = JSON.parse(this.validation.getToken());
    let userId = this.userData.userId

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
      console.log(jsonData)
      if (jsonData && jsonData.status == true) {
          this.fileName = jsonData.data;
          this.my_url = jsonData.data;
      } else {
        this.validation.presentToast(jsonData.message);
      }
    }, err => {
      console.log("err", err)
    });
  }
  get_single_ticket_detail() {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.response = this.commonService.get('ticket/get/'+this.ticket_code, {}, { headers: headers });
    this.response.subscribe((data) => {
      this.validation.dismissLoading();
      console.log(data);
      if (data.status == true) {
        this.ticket_id = data.data.ticketId;
        this.topicObj['topicId'] = data.data.topicId;
        this.topicName = data.data.topicdetails.topicname;
        this.user_id = data.data.userId;
        this.exp_date = data.data.expiredDate;
        this.created_date = data.data.createdAt;
        this.updated_date = data.data.updatedAt;
        this.assign_id = data.data.assignedTo;
        this.my_url = data.data.fileUrl;
        this.status = data.data.status;
        this.code = data.data.code;
        this.subject = data.data.subject;
        this.description = data.data.description;
        this.priority = data.data.priority;
      }
      else {
        //this.validation.presentToast(data.responseMessage); 
      }

    }), err => {

      this.validation.dismissLoading();
      this.validation.presentToast(err);

    };
  }

  get_topic() {
    this.validation.presentLoading();
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.response = this.commonService.get('ticket/topic/getall', {}, { headers: headers });
    this.response.subscribe((data) => {
      console.log(data, "datatatatatatatataatatat")

      this.validation.dismissLoading();

      if (data.status == true) {
        this.topic_detail = data.data;
      }

    }), err => {

      this.validation.dismissLoading();
      this.validation.presentToast(err);

    };
  }
  form_validation() {
    if (!this.subject) {
      this.validation.presentToast("Please Enter Subject");
      return
    }

    if (!this.description) {
      this.validation.presentToast("Please Enter Description");
      return
    }

    this.submit_form();
  }
  SelectTopic(topics){
    this.topicObj = this.topic_detail.find(data => data.topicname == topics)
    console.log(topics, this.topicObj, "dfhgdshgfdjshgfjgdsh")
  }
  sendMessage(){
    var time = new Date();
    let curenttime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let obj = {
      "userId":this.userData.userId,
      "name": this.userData.name,
      "mode":"cusomter",
      "content":this.description,
      "date": new Date().toLocaleDateString(),
      "time": curenttime
    }
    this.descriptionArray.push(obj);
     console.log(this.descriptionArray)
  }
  submit_form() {
    this.sendMessage()
    this.validation.presentLoading();
    if (this.ticket_code == null) {
      let id = this.userData.userId;
      let param = {
        "subject":this.subject,
        "name":this.topicObj['topicname'],
        "topicId": this.topicObj['topicId'],
        "priority":this.priority,
        "description": this.descriptionArray,
        "userId": id,
        "status": "Initiated",
         filedata: this.fileName,
      }
      console.log(param);
      this.response = this.commonService.post('ticket/create', param, true);
      this.response.subscribe((data) => {
        this.validation.dismissLoading();
        console.log(data);
        this.print_jsondata = data;
        this.validation.presentToast("Ticket Successfully Raised");
        this.navController.navigateBack(['Ticket/', { animated: true }]);
      }), err => {
        this.validation.dismissLoading();
        this.validation.presentToast(err);

      };
    }
    else {
      let param = {
        "id": this.ticket_id,
        "topic": {
          "id": this.topicObj['topicId'],
          "name": this.topic_name,
          "isActive": true
        },
        "subject": this.subject,
        "description": this.description,
        "fileUrl": this.my_url,
        "priority": this.priority,
        "user": {
          "id": this.user_id
        },
        "createdDate": this.created_date,
        "updatedDate": this.updated_date,
        "expiredDate": this.exp_date,
        "assignedTo": {
          "id": this.assign_id
        },
        "status": this.status,
        "code": this.code
      }

      console.log(param);
      this.response = this.commonService.put('ticket/update', param, true);

      this.response.subscribe((data) => {

        this.validation.dismissLoading();
        this.validation.presentToast("Ticket Successfully Updated");
        this.navController.navigateBack('Ticket', { animated: true });

      }), err => {

        this.validation.dismissLoading();
        this.validation.presentToast(err);

      };
    }
  }

  goback() {
    this.navController.back({ animated: true });
  }
}
