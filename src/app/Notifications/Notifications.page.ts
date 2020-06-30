import { CommonHelper } from 'src/providers/helper';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { commonService } from '../services/serviceFile';
import { validationService } from '../services/validation.service';
import { MenuController, ActionSheetController } from '@ionic/angular';
import { Config } from './../../providers/Config';
import { Router } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { Chat } from "src/providers/Chat";

@Component({
  selector: 'app-Notifications',
  templateUrl: 'Notifications.page.html',
  styleUrls: ['Notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  userData: any;
  allPets: any;
  pairPetList: any;
  totalLists: any = [];
  checksonce = false;
  deleteId = [];
  totalNewLists = 0;
  public socket;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    public commonService: commonService,
    public validation: validationService,
    private menu: MenuController,
    public alertController: AlertController,
    public Config: Config,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public chat: Chat,
    private fcm: FCM,
    private platform: Platform,
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    
    this.socket = Chat.SocketObj;
    // this.platform.ready().then(() => {
      this.socket.on('totalnotification', (msg) => {
        console.log("totalnotification", msg, "notifi")
        this.totalNewLists = msg
        this.ngOnInit()
      });
    }
    ngOnInit() {
      //Get ALL
      this.getNotificationCount()
      let token = JSON.parse(this.validation.getToken())
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
      let userId = this.userData.userId;
      this.commonService.get('notification/getnotification', {}, { headers: headers }).subscribe((resdata: any) => {
        console.log(resdata.data, resdata.data.length)
        let unreadlen = [], unreadlen2= [];
      if (resdata.status) {
        this.totalLists = []
        let notifications = resdata.data;
        notifications.forEach((key, val) => {
          if(!this.totalLists.length){
            if(key.flag == 0){
              key["unread"] = 1;
            }
            this.totalLists.push(key)
          }
          else {
            // this.totalLists.forEach((key2, val2) => {
            //  if(key.flag == 0){
               let findsameid =  this.totalLists.find(key2 => key.userId == key2.userId && key2.info.petId == key.info.petId && key2.ownerId == key.ownerId)
              //  let findsameid2 = unreadlen2.find(key2 => key.userId == key2.userId && key2.info.petId == key.info.petId)
               if(findsameid){
                if(findsameid["unread"] == undefined && key.flag == 0){
                  findsameid["unread"] = 1;
                }else if(findsameid["unread"] != undefined && key.flag == 0){
                  findsameid["unread"] = findsameid["unread"] + 1;
                }
                findsameid = {content : key.content}
               }else {
                if(key["unread"] == undefined && key.flag == 0){
                  key["unread"] = 1;
                }else if(key["unread"] != undefined && key.flag == 0){
                  key["unread"] = key["unread"] + 1;
                }else if(key.flag == 1){

                }
                this.totalLists.push(key)
                // if(key.flag == 0){
                //   if(!unreadlen2.length){
                //     unreadlen2.push(key);
                //     key["unread"] = unreadlen.length;
                //   }
                // }
                // if(findsameid2){
                //  findsameid2["unread"] = findsameid2["unread"] + 1;
                // }
               }
              // }
            // })
          }
          console.log(this.totalLists, "kjdldljf")
        })
        // if(notifications.length > 1){
        //   notifications.forEach((key, val) => {
        //     if(!this.totalLists.length){
        //       this.totalLists.push(key)
        //     }else {
        //       let findsameid = this.totalLists.find(key2 => key.userId == key2.userId && key2.info.petId == key.info.petId)
        //       if(findsameid){
        //         findsameid = {
        //           content : key.content
        //         }
        //       }else {
        //         this.totalLists.push(key)
        //       }
        //     }
        //   })
        // }else {
        //   this.totalLists = resdata.data;
        // }
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

  }
  getNotificationCount(str?) {
    console.log(str, "strstr")
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('notification/totalnewnotifications', {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.totalNewLists = resdata.data
        console.log(this.totalNewLists, resdata.data, "saf")
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  viewProfile(data) {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('notification/flag/?id=' + data._id, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
    console.log(data, "not")
    this.commonService.get('pets/getpet/' + data.info.petId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        resdata.data["from"] = "notification";
        resdata.data["otherUserId"] = data.ownerId;

        this.Config.setNav("obj", resdata.data);
        this.router.navigate(['/chat']);
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  sendNotification(PetId) {
    // this.userData.userId
    // let token = JSON.parse(this.validation.getToken())
    // const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    // this.commonService.get('pets/viewed/' + PetId + '/' + this.userData.userId, {}, { headers: headers }).subscribe((resdata: any) => {
    //   this.validation.dismissLoading();
    //   if (resdata.status) {
    //     console.log(resdata.data);
    //     this.validation.presentToast(resdata.message);
    //   } else {
    //     this.validation.presentToast(resdata.message);
    //   }
    // }), err => {
    //   this.validation.presentToast(err);
    // };
  }

  async viewMsg(data) {
    console.log(data)
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('pets/getpet/' + data.info.petId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.Config.setNav("pet", resdata.data);
        this.Config.setNav("msg", data);
        this.Config.setNav("show", 1);
        this.router.navigate(['/singleProfile'])

        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  pushId(id, i) {
    if (!this.deleteId.length) {
      this.deleteId.push(id)
    } else {
      let checkId = this.deleteId.find(id1 => id1 == id);
      if (checkId) {
        this.deleteId = this.deleteId.filter(id1 => id1 != id)
      } else if (!this.deleteId.includes(id)) {
        this.deleteId.push(id)
      }
    }
  }
  deleteAll() {
    let ids = {
      "selectids": this.deleteId
    }
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.post('notification/deletenotification', ids, true).subscribe((resdata: any) => {
      console.log(resdata.data, ids);
      if (resdata.status) {
        this.checksonce = false
        this.ngOnInit();
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  cancelNotify() {
    this.checksonce = false;
  }
  CallSelect() {
    if(this.checksonce){
      this.checksonce = false;
    }else {
      this.checksonce = true;

    }
  }
  ionviewwillenter(){
    this.ngOnInit()
  }
  clearAll() {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.delete('notification/clearallnotification', { headers: headers }).subscribe((resdata: any) => {
      console.log(resdata.data);
      if (resdata.status) {
        this.ngOnInit();
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'select Option',
      buttons: [
        {
          text: 'select',
          icon: 'checkmark-outline',
          handler: () => {
            console.log('Share clicked');
            this.checksonce = true;
          }
        },
        {
          text: 'clear All',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');

          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }
}
