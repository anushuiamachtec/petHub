import { Component, OnInit, TemplateRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { validationService } from '../../services/validation.service';
import { commonService } from '../../services/serviceFile';
import { HttpHeaders } from '@angular/common/http';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.page.html',
  styleUrls: ['./ticket-detail.page.scss'],
})
export class TicketDetailPage implements OnInit {
  // modalRef: BsModalRef | null;
  response;
  ticket_id: any;
  id: string = '';
  topic_name: string = '';
  ticket_name: string = '';
  topic_detail: any = [];
  user: any = '';
  assign_to: any = '';
  subject: string = '';
  description: string = '';
  proirity: string = '';
  date_time: string = '';
  resolution_date: any = '';
  image_path: string = 'string';
  status: any;
  date: string = '';
  Time: string = '';
  error_status: boolean = false;
  rating: any = '';
  start_no: any = [];
  updateObj: any = {};
  userData;
  content;
  deleteId = [];
  checksonce = false;
  constructor(
    private commonService: commonService,
    private validation: validationService,
    private navController: NavController,
    public router: Router,
    public platform: Platform,
    public routerOutlet: IonRouterOutlet,
    public activatedRoute: ActivatedRoute,
    // public modalService : BsModalService
  ) {
    this.start_no = [1, 2, 3, 4, 5];
    this.ticket_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  ngOnInit() {
    this.get_single_tickets();
  }

  ionViewWillEnter() {

  }

  get_single_tickets() {
    this.validation.presentLoading();
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.response = this.commonService.get('ticket/get/' + this.ticket_id, {}, { headers: headers });
    this.response.subscribe((data) => {
      this.validation.dismissLoading();
      if (data.status == true) {
        this.updateObj = data.data;
        // this.updateObj.forEach((key) => {
        var str = this.updateObj.createdAt;
        var dates = str.split("T", 10);
        this.updateObj['Date'] = dates[0];
        var time = dates[1].split('.')
        this.updateObj['Time'] = time[0];
        var str1 = this.updateObj.expiredDate;
        var dates = str1.split("T", 10);
        this.updateObj['expDate'] = dates[0];
        var time = dates[1].split('.')
        this.updateObj['expTime'] = time[0];
        // });
        // this.error_status = false;
        // this.ticket_name = data.data.code;
        // this.topic_detail = data.response.topic;
        this.user = data.data.userId;
        // this.assign_to = data.response.assignedTo.id;
        this.topic_name = data.data.topicdetails.topicname;
        this.id = data.data.ticketId;
        // this.subject = data.response.subject;
        this.image_path = data.data.fileUrl;
        this.date = data.data.Date;
        this.Time = data.data.Time;
        this.status = data.data.status;

        // this.description = data.response.description;
        // this.date_time = data.response.createdDate;
        // this.resolution_date = data.response.expiredDate;
        // this.proirity = data.response.priority;
        // this.status = data.response.status;
        for (let k = 1; k <= data.data.rating; k++) {
          document.getElementById('rate_' + k).classList.add('checked');
        }
      }
      else {
        this.error_status = true;
        this.validation.presentToast(data.message);
      }

    }), err => {
      this.error_status = true;
      this.validation.dismissLoading();
      this.validation.presentToast(err);
    };
  }
  backmenu() {
    this.router.navigateByUrl('/Ticket')
  }
  sendMessage() {
    var time = new Date();
    let curenttime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let obj = {
      "userId": this.userData.userId,
      "name": this.userData.name,
      "mode": "cusomter",
      "content": this.content,
      "date": new Date().toLocaleDateString(),
      "time": curenttime
    }
    this.updateObj.description.push(obj);
    
    let jsonObj = {
      ticketId: this.updateObj.ticketId,
      description: this.updateObj.description
    }
    // this.http.post(this.url.baseAPIUrl + 'ticket/employeecomment', jsonObj, { headers: headers }).subscribe((data: any[]) => {
    this.response = this.commonService.post('ticket/usercomment', jsonObj, true)
    this.response.subscribe((data) => {
      console.log(data);
      if (data['status'] == true) {
      }
      else {
      }
    });
    this.content = ""
  }
  give_rating(s) {
    if (this.rating != 0) {
    }
    else {
      this.validation.presentLoading();
      let param = { "ticketId": this.ticket_id, 'rating': s };
      for (let i = 1; i <= s; i++) {
        document.getElementById('rate_' + i).classList.add('checked');
      }
      this.response = this.commonService.post('ticket/rating/add', param, true);
      this.response.subscribe((data) => {
        this.validation.dismissLoading();
        this.validation.presentToast(data.responseMessage);
        // this.modalRef.hide();
        this.navController.navigateBack(['Ticket/', { animated: true }]);
      }), err => {
        this.validation.dismissLoading();
        this.validation.presentToast(err);
      };
    }
  }

  close_ticket(Addrating: TemplateRef<any>) {
    // this.validation.presentLoading();
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.response = this.commonService.get('ticket/close/' + this.user + '/' + this.id, {}, { headers: headers });
    this.response.subscribe((data) => {
      this.validation.dismissLoading();
      if (data.status) {
        this.validation.presentToast("Ticket Successfully Closed");
        this.navController.navigateBack(['Ticket/', { animated: true }]);
        // this.modalRef = this.modalService.show(Addrating, Object.assign({}, { class: 'create-country-popup' }));
        // this.navController.navigateBack(['Support/', { animated: true }]);
      }
      else {
        this.validation.presentToast(data.errorResponseDTO.errorMessage);
      }
    }),
      err => {

        this.validation.dismissLoading();
        this.validation.presentToast(err);

      };
  }

  goback() {
    this.navController.navigateBack('', { animated: true });
  }
  add_ticket() {
    this.navController.navigateForward('ticket-form', { animated: true });
  }
  zooming_image(image_path) {
    if (image_path != 'https://www.virtualsecretary.in/admin/konzept/topic_commonService/public/blank.png') {
      this.navController.navigateForward(['image', { url: image_path, id: this.ticket_id }]);
    }
  }
  
}
