import { CommonHelper } from 'src/providers/helper';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Component, OnInit} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { commonService } from '../services/serviceFile';
import { validationService } from '../services/validation.service';
import { MenuController } from '@ionic/angular';
import { Config } from './../../providers/Config';
import { ModalController } from '@ionic/angular';
import { MessageServiePage } from '../Messages/Message_Servie.page';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import {
    
    SafeHtml,
    SafeUrl,
    SafeStyle
} from '@angular/platform-browser';
@Component({
  selector: 'app-singleProfile',
  templateUrl: 'singleProfile.component.html',
  styleUrls: ['singleProfile.component.css'],
})
export class singleProfilePage implements OnInit{
  userData: any;
  allPets:any;
    MessageContent: any;
  singlePet  :  any = {};
  petId:any;
  totalLists:any ;
  msgUserData:any;
  singleMsg:any;
  showWhat:any;
    public header:SafeHtml;
    public content:SafeHtml[];
    public image:SafeStyle;
    public isActive:boolean;
    public isExtended:boolean;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    public commonService: commonService,
    public validation: validationService,
    public menuCtrl: MenuController,
    public Config: Config,
    public modalController: ModalController,
        public alertController: AlertController,
        public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.singlePet = this.Config.getNav("pet");
    this.singleMsg = this.Config.getNav("msg");
    this.showWhat = this.Config.getNav("show")

    // this.msgUserData = JSON.parse(localStorage.getItem('MsgUser'));
    console.log(this.userData ,this.showWhat,this.msgUserData)
  } 
  ngOnInit() { 
    if(this.showWhat == 1){
      this.viewMsg(this.singleMsg)
    }else{
      console.log(this.showWhat)
    }  
    console.log(this.singlePet, this.showWhat,"this.singlePet")
      let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let userId = this.userData.userId;
    this.commonService.get('notification/getnotification', {}, { headers: headers }).subscribe((resdata: any) => {
      this.validation.dismissLoading();
      if (resdata.status) {
        this.totalLists = resdata.data;
        console.log(resdata.data);
        this.validation.presentToast(resdata.message);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  } 
  //  async presentModal() {
  //   const modal = await this.modalController.create({
  //     templateUrl: MessageServiePage
  //   });
  //   return await modal.present();
  // }
  // }
  chatDetail(item){
    console.log("iteewee", item);
    this.Config.setNav("obj",item);
    this.router.navigate(['/chat']);
  }
  openMenu() {
    this.menuCtrl.open();
  }
  async viewMsg(data) {
    const alert = await this.alertController.create({
      header: 'Message sent by',
      message: data.content,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            
          }
        }
      ]
    });
    await alert.present();
  }
   sendMsg() {
    let sendmsg = {
      "userId": this.userData.userId,
      "petId": this.singlePet.petId,
      "content": this.MessageContent
    }
    console.log(sendmsg, "hgjjhhgh")
  
  let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.post('pets/message', sendmsg, true).subscribe((resdata: any) => {
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
 
}
