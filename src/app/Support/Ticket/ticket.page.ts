import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { validationService } from '../../services/validation.service';
import { commonService } from '../../services/serviceFile';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  response;
  tickets: any = [];
  ticketsHistory : any = []
  error_status: boolean = false;
  private searchFilter: any = {
    orderStatus: '',
    searchdate: '',
    searchdate2: ''
  };
  userData;

  constructor(
    private commonService: commonService,
    private validation: validationService,
    private navController: NavController,
    public router: Router,
    public platform: Platform,
    public routerOutlet: IonRouterOutlet
  ) {
    this.userData = JSON.parse(localStorage.getItem('userData'));

  }

  ngOnInit() {
    this.get_tickets();
  }

  ionViewWillEnter() {

  }
  filterNav() {
    document.getElementById("mySidebar").style.width = "100%";
  }
  closeNav(){
    document.getElementById("mySidebar").style.width = "0%";
    this.searchFilter = {
      orderStatus: '',
    searchdate: '',
    searchdate2: ''
    }
  }
  filterDate(data){
    console.log(data,'datadatadta')
  }
  get_tickets() {
    this.validation.presentLoading();
    let userId = this.userData.userId;
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.response = this.commonService.get('ticket/getuser/'+userId, {}, { headers: headers });
    this.response.subscribe((data) => {
      this.validation.dismissLoading();
      if (data.status == true) {
        this.error_status = false;
        this.tickets = data['data'];
        this.ticketsHistory = data ['data'];
        this.tickets.forEach((key) => {
          var str = key.createdAt;
          var dates = str.split("T",10);      
          var splitDate = dates[0].split('-')
          let newDate = ( splitDate[2]  + "-" + splitDate[1] + "-" +  splitDate[0]);
          key ['Date'] = newDate;
          var time = dates[1].split('.')
          key['Time'] = time [0];
          var d = new Date(key.created_at * 1000);	
          if(key.expiredDate != undefined){
            key ['ExpDate'] = this.dateConversion(key.expiredDate)
          }	
		
        });
        this.orderHistorybyDay(this.tickets);
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
  filterViaCategory(arr, category) {
    return arr.filter(obj => obj.dayOrder.some(cat => cat.Date === category));
  }

  async orderHistorybyDay(data2) {
    let newArray = [];
    let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let newObj: any = {}
    let data = data2.reverse()
    await data.forEach(async (key, val) => {
      var d = new Date(key.createdAt);
      var n = d.getDay()
      newObj = {
        "day": weekday[n],
        "date": key.Date,
        // "orderId" :key.orderId,
        "dayOrder": [key]
      };
      if (newArray.length) {
        var filterdataV = this.filterViaCategory(newArray, key.Date);
        if (filterdataV.length) {
          await filterdataV.forEach(async (keyorder, valorder) => {
            keyorder.dayOrder.push(key);
          });
               
        } else {
          if (newArray.indexOf(newObj) === -1) {
            await newArray.push(newObj);
          }
        }
      } else {
        await newArray.push(newObj)
      }
    });
    this.tickets = JSON.parse(JSON.stringify(newArray));
    console.log( this.tickets ,' this.tickets  this.tickets  this.tickets ')
    // return this.tickets;
  }
  add_ticket() {
    this.navController.navigateForward('createTicket', { animated: true });
  }
  update_ticket(id) {
    this.navController.navigateForward(['createTicket/', { id: id }]);
  }
  
  viewTicket(id) {
    this.navController.navigateForward(['ViewTicket/', { id: id }]);
  }
  backmenu(){
    this.router.navigateByUrl('/Dashboard')
  }
  dateConversion(data) {
		var array: any = [];
		var newDate, myString = data
		array = myString.split('T',10);
		var array2 = array[0].split('-');
    newDate = (array2[2] + "-" +array2[1] + "-" + array2[0]);
    console.log(newDate,'newDatenewDatenewDatenewDate')
		return newDate;
	}
  filterApply(data) {  
    
    var filterdata, searchdate2;
    this.tickets = []
    if (data.searchdate == "") {
      filterdata = undefined;
    } else if (data.searchdate != undefined) {
      filterdata = this.dateConversion(data.searchdate)
      // filterdata = data.searchdate;
    }
    if (data.searchdate2 == "") {
      searchdate2 = undefined;
    } else if (data.searchdate2 != undefined) {
      // searchdate2 = data.searchdate2;
      searchdate2 = this.dateConversion(data.searchdate2)
    }
    if (data.orderStatus == "") {
      data.orderStatus = undefined;
    }
    let Result = [];
    if (data.orderStatus != undefined && filterdata != undefined && searchdate2 != undefined) {
      this.ticketsHistory.forEach((key, val) => {
        if (data.orderStatus == key.status && key.Date >= filterdata && key.Date <= searchdate2) {
          this.tickets.push(key);
          console.log(this.tickets,'thisgdusyfugfedf')
          return this.tickets;
        }
      })
    } else if (data.orderStatus == undefined && filterdata != undefined && searchdate2 != undefined) {
      this.ticketsHistory.forEach((key, val) => {
        if (key.Date >= filterdata && key.Date <= searchdate2) {
          this.tickets.push(key);
          console.log(this.tickets,'thisgdusyfugfedf')
          return this.tickets;
        }
      })
    } else if (data.orderStatus != undefined && filterdata != undefined) {
      this.ticketsHistory.forEach((key, val) => {
        if (data.orderStatus == key.status && filterdata == key.Date) {
          this.tickets.push(key);
          console.log(this.tickets,'thisgdusyfugfedf')
          return this.tickets;
        }
      })
    } else if (data.orderStatus != undefined && filterdata == undefined) {
      this.ticketsHistory.forEach((key, val) => {
        if (data.orderStatus == key.status) {
          this.tickets.push(key);
          console.log(this.tickets,'thisgdusyfugfedf')
          return this.tickets;
        }
      })
    } else if (data.orderStatus == undefined && filterdata != undefined) {
      this.ticketsHistory.forEach((key, val) => {
        if (filterdata == key.Date) {
          this.tickets.push(key);
          console.log(this.tickets,'thisgdusyfugfedf')
          return this.tickets;
        }
      })
    } else if (!this.tickets.length) {
      this.validation.presentToast("no more data found")
    }
    this.searchFilter = {
      orderStatus: '',
    searchdate: '',
    searchdate2: ''
    }
    // this.orderHistorybyDay(this.products);
    this.closeNav()
    return this.tickets
  }
}
