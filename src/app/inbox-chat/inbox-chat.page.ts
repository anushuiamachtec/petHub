import { Camera } from '@ionic-native/camera/ngx';
// import { CameraProvider } from 'src/providers/Camera';
import { CameraProvider } from 'src/providers/camera';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, IonContent, Events } from '@ionic/angular';
import { CommonHelper } from "src/providers/helper";
import { Chat } from "src/providers/Chat";
import { Config } from "src/providers/Config";
import { PermissionsService } from "src/providers/PermissionCheck";
import { Network } from '@ionic-native/network/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { validationService } from '../services/validation.service';
import { commonService } from '../services/serviceFile';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inbox-chat',
  templateUrl: './inbox-chat.page.html',
  styleUrls: ['./inbox-chat.page.scss'],
})
export class InboxChatPage implements OnInit {

  @ViewChild('content', { static: false }) content: IonContent;
  public data;
  public allChats = [];
  public message;
  public user;
  public socket;
  public globalListenFunc;
  public uploading = true;
  public online = false;
  public msg: any = {
    otherUserId: '',
    userId: '',
    message: '',
    messageType: 'TEXT',
    created_at: new Date()
  };
  public client_typing = false;
  public typing = false;
  public timeout = undefined;
  public page = 0;
  public last_page;
  public event;
  public keyboardHeight = 0;
  public _url = Config.conf.img_url;
  public loadStatus = false;
  public windowId;
  public userbackground;
  public getuserstatus;
  public loginUser;
  deleteId = [];
  checksonce = false;
  constructor(public navCtrl: NavController,
    public helper: CommonHelper,
    public camera: CameraProvider,
    public platform: Platform,
    public network: Network,
    public config: Config,
    public chat: Chat,
    private PermissionsService: PermissionsService,
    public events: Events,
    public keyboard: Keyboard,
    public modalCtrl: ModalController,
    public validation: validationService,
    public commonService: commonService,
    //public navParams: NavParams
  ) {
    let obj = this.config.getNav("obj");
    let currentUser = JSON.parse(localStorage.getItem('userData'));
    this.config.setConf("user", currentUser);
    this.events.publish("connectSocket", currentUser);
    this.data = obj;
    this.loginUser = currentUser;
    this.msg.userId = currentUser.userId;
    if(obj.from == "notification"){
      this.msg.otherUserId = obj.otherUserId;
      this.windowId = obj.otherUserId;
    }else{
      this.msg.otherUserId = obj.userId;
      this.windowId = obj.userId;
    }
    this.user = obj;
    this.config.setConf('chat_window_active_user', this.windowId);
    this.socket = Chat.SocketObj;
    this.socket.emit('socket_online', this.msg.userId);
    this.socket.on('deletereceiveMessage', (msg) => {
      console.log("deletereceiveMessage", msg)
      this.allChats = [];
      this.allChats = msg;
    });
    this.checkNetwork();
    keyboard.onKeyboardShow().subscribe(e => {
      if (this.platform.is('ios')) {
        this.keyboardHeight = e['keyboardHeight'];
        document.getElementById('chatList').style.marginTop = this.keyboardHeight + 'px';
        document.getElementsByClassName('chatheader')['0'].style.marginTop = this.keyboardHeight + 'px';
      }
    });

    keyboard.onKeyboardHide().subscribe(e => {
      if (this.platform.is('ios')) {
        this.keyboardHeight = e['keyboardHeight'] | 0;
        document.getElementById('chatList').style.marginTop = this.keyboardHeight + 'px';
        document.getElementsByClassName('chatheader')['0'].style.marginTop = this.keyboardHeight + 'px';
      }
    });

    platform.resume.subscribe((e) => {
      setTimeout(() => {
        this.chat.registerEvents((type, data) => {
          console.log(type, data, this.windowId, this.user.userId)
          switch (type) {
            case "send_message":
              console.log(type)
              if (this.windowId == data.userId) {
                this.allChats.push(data);
                setTimeout(() => {
                  if (this.content)
                    this.content.scrollToBottom(100);//300ms animation speed
                }, 1);
              }
              break;
            case "typing_show":
              if (this.windowId == data.userId) {
                this.client_typing = true;
              }
              break;
            case "typing_stop_show":
              if (this.windowId == data.userId) {
                this.client_typing = false;
              }
              break;
            case "user_online":
              if (this.windowId == data.userId) {
                this.online = true;
              }
              break;
            case "user_offline":
              if (this.windowId == data.userId) {
                this.online = false;
              }
              break;
              console.log(type)

          }
        });
      }, 2000);
    });

    this.chat.registerEvents((type, data) => {
      switch (type) {
        case "send_message":
          if (this.windowId == data.userId) {
            this.allChats.push(data);
            setTimeout(() => {
              if (this.content)
                this.content.scrollToBottom(100);//300ms animation speed
            }, 1);
          }
          break;
        case "typing_show":
          if (this.windowId == data.userId) {
            this.client_typing = true;
          }
          break;
        case "typing_stop_show":
          if (this.windowId == data.userId) {
            this.client_typing = false;
          }
          break;
        case "user_online":
          if (this.windowId == data.userId) {
            console.log(this.online, this.client_typing, type)
            this.online = true;
          }
          break;
        case "user_offline":
          if (this.windowId == data.userId) {
            console.log(this.online, this.client_typing, type)
            this.online = false;
          }
          break;

      }
    });
    this.getAllChats();
  }
  checkNetwork() {
    this.network.onConnect().subscribe(data => {
      this.getAllChats();
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
    }, error => console.error(error));
  }
  ngOnInit() {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.get('user/getuser/' + this.loginUser.userId, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status) {
        this.loginUser["images"] = resdata.data.images
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }

  setKeybord() {
  }

  getKeyboardStyle() {
    if (this.platform.is('ios')) {
      let style = {
        'top': this.keyboardHeight ? this.keyboardHeight + 'px' : '0px'
      }
      return style;
    }
  }

  ionViewDidLoad() {
    document.addEventListener('keydown', (key) => {
      this.keydown(key)
    });
  }
  
  ionViewDidLeave() {
    this.socket = Chat.SocketObj
    this.socket.emit('socket_offline', this.msg);
    clearInterval(this.getuserstatus);
  }

  keydown(key) {

    let timeOutFunc = () => {
      this.typing = false;
      Chat.SocketObj.emit('typing_stop', this.msg);
    };

    if (this.typing == false && key.key != 'Enter') {
      this.typing = true;
      Chat.SocketObj.emit('typing', this.msg);
      this.timeout = setTimeout(timeOutFunc, 1000);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(timeOutFunc, 1000);
    }
  }

  ionViewWillEnter() {
    this.config.setConf('iskeyboardapply', 0);
    document.body.classList.add('removeTabs');
  }
  getAllChats() {
    console.log(this.user,this.user.from, "userss")
    this.msg.petId = this.user.petId;
    this.chat.getAllMessages(this.msg, (data) => {
      this.allChats = [];
      this.allChats = data.concat(this.allChats);
      console.log(this.allChats, "all")
      setTimeout(() => {
        let element = document.querySelector(".cnt");
        if (element) {
          element.classList.remove("cnt");
          if (this.content)
            this.content.scrollToBottom(0);
        }
      }, 100);
    });
  }

  @ViewChild('input', { static: false }) myInput;

  sendNotification() {
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let id;
    if(this.user.from == "notification"){
      id = this.user.otherUserId;
    }else{
      id = this.user.userId;
    }
    this.commonService.get('user/getuser/' + id, {}, { headers: headers }).subscribe((resdata: any) => {
      if (resdata.status && resdata.data.online == "0") {
        this.msg.deviceToken = resdata.data.deviceToken;
        this.msg.deviceType = resdata.data.deviceType
        alert(resdata.data.deviceToken)
        this.commonService.post('chatnotification', this.msg, true).subscribe((resdata: any) => {
          if (resdata.status) {
          } else {
            this.validation.presentToast(resdata.message);
          }
        }), err => {
          this.validation.presentToast(err);
        };
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };

  }
  sendMessage() {
    if (this.message.trim() != "" && this.message != '' && this.message != undefined) {
      this.msg.message = this.message;
      this.msg.messageType = 'TEXT';
      this.msg.petId = this.user.petId
      this.msg["chatdeleteuserId"] = ""
      this.msg["chatdelete"] = false
      console.log(this.msg)
      this.chat.sendMessage(this.msg, (data) => {
      });
      setTimeout(() => {
        this.getAllChats();
        }, 100);
      this.sendNotification()
      this.message = '';
      this.socket = Chat.SocketObj
      this.socket.emit('typing_stop', this.msg);
        setTimeout(() => {
          this.socket.emit('total_notification', this.msg);
      }, 5000);
      setTimeout(() => {
        if (this.content)
          this.content.scrollToBottom(100);//300ms animation speed
      }, 1);
    }
  }

  uploadPicture() {
    this.camera.open((data) => {
      let msg = JSON.parse(JSON.stringify(this.msg));
      msg.upload_img = data.image;
      msg.from_name = msg.from_name;
      msg.type = 'IMAGE';
      msg.created_at = new Date();
      msg.message = "Image Shared";
      setTimeout(() => {
        this.chat.sendMessage(msg, (res) => {
          if (res.error_status == false) {
            this.uploading = false;
          }
          // msg.message = res.data.message;
          msg.message = data.image;
          this.allChats.push(msg);
          setTimeout(() => {
            if (this.content)
              this.content.scrollToBottom(100);//300ms animation speed
          }, 2000);
        });
      }, 1000);

    })
  }
  errorHandler(event) {
    event.target.src = 'assets/imgs/blank-avatar.png';
  }
  ionViewWillLeave() {
    this.config.setConf('iskeyboardapply', 1);
    document.body.classList.remove('removeTabs');
    this.config.setConf('chat_window_active_user', 0);
    this.windowId = 0;
  }

  otherProfilePage(data) {
    this.navCtrl.navigateForward(['OtherProfilePage', { from: 'chat', user: data, prevCompRef: this }]);
  }

  autogrow() {
    let textArea = document.getElementById("inputID")
    if (textArea.scrollHeight < 150) {
      textArea.style.overflow = 'hidden';
      textArea.style.height = '0px';
      textArea.style.height = textArea.scrollHeight + 'px';
    } else {
      textArea.style.overflow = 'scroll';
    }
  }

  imagePopup(data) {
    this.navCtrl.navigateForward(['ImagePopup', { data: data }]);
  }
  CallSelect() {
    if(this.checksonce){
      this.checksonce = false;
    }else {
      this.checksonce = true;

    }
  }
  pushId(id, i,msg) {
    console.log(msg, "dfsdjf")
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
      "chatids": this.deleteId
    }
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    this.commonService.post('chat/delete', ids, true).subscribe((resdata: any) => {
      console.log(resdata.data, ids);
      if (resdata.status) {
        setTimeout(() => {
          this.getAllChats();
        }, 100);
        let id;
        if(this.user.from == "notification"){
          id = this.user.otherUserId;
        }else{
          id = this.user.userId;
        }
        var demoObj = {
          "userId": id,
          "otherUserId": this.msg.userId,
          "petId": this.user.petId
        }
        console.log(demoObj)
          setTimeout(() => {
              this.socket.emit('deletegetMessage', demoObj);
          }, 2000);
        this.checksonce = false;
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
  clearAll() {
    let chatids = [];
    this.allChats.forEach((key, val) => {
      chatids.push(key._id)
    })
    let token = JSON.parse(this.validation.getToken())
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let ids = {
      "chatids": chatids
    }
    this.commonService.post('chat/clearall',ids, true).subscribe((resdata: any) => {
      console.log(resdata.data);
      if (resdata.status) {
        this.checksonce = false;
        setTimeout(() => {
          this.getAllChats();
        }, 100);
      } else {
        this.validation.presentToast(resdata.message);
      }
    }), err => {
      this.validation.presentToast(err);
    };
  }
}
