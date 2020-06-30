import { CommonHelper } from 'src/providers/helper';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { commonService } from '../services/serviceFile';
import { validationService } from '../services/validation.service';
import { MenuController, ActionSheetController } from '@ionic/angular';
import { Config } from './../../providers/Config';
import { Router } from "@angular/router";
@Component({
  selector: 'app-MessageServie',
  templateUrl: 'Message_Servie.page.html',
  styleUrls: ['Message_Servie.page.scss'],
})
export class MessageServiePage implements OnInit {
  userData: any;
  msgUserData: any;
  allPets: any;
  pairPetList: any;
  totalLists: any = [];
  checksonce = false;
  deleteId = [];
  MessageContent: any;
  constructor(public helper: CommonHelper,
    public storage: Storage,
    public navCtrl: NavController,
    public commonService: commonService,
    public validation: validationService,
    private menu: MenuController,
    public Config: Config,
    public router: Router,
    public actionSheetController: ActionSheetController
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.msgUserData = JSON.parse(localStorage.getItem('MsgUser'));
    console.log(this.msgUserData)
  }
  ngOnInit() {
    //Get ALL
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
  sendMsg() {
    let sendmsg = {
      "userId": this.userData.userId,
      "petId": this.msgUserData.petId,
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
