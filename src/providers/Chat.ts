import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Config } from "./Config";
import { ModalController, Platform, Events } from "@ionic/angular";
import { CommonHelper } from "./helper";
import { Storage } from '@ionic/storage';
import { PermissionsService } from "./PermissionCheck";

@Injectable()
export class Chat {

  socket: any;
  static SocketObj;
  public allSubscribers = [];
  public callingPopup = 0;
  public static getViewsCount = 0;
  public user: any;
  private deviceToken;
  constructor(
    public config: Config,
    public modalCtrl: ModalController,
    public helper: CommonHelper,
    public events: Events,
    public storage: Storage,
    private PermissionsService: PermissionsService,
    public platform: Platform
  ) {
    this.storage.get('fcmId').then((val) => {
      if (val) {
        this.deviceToken = val
      } else {
        this.deviceToken = ""
      }
    });
    console.log(events, "chat")
    events.subscribe('connectSocket', (user) => {
      this.user=user;
      this.removeAllEvents();
      console.log(user)
      console.log(user._id)
      this.conectSocket(user.userId);
      this.registerEvents((type, data) => {
        console.log("SocketEvent",type,data)
      });
    });
    events.subscribe('disconnectSocket', () => {
      console.log("call data disconnectsocket")
      this.removeAllEvents();
      this.socket.disconnect();
  });


    platform.resume.subscribe((e) => {
      this.removeAllEvents();
      this.storage.get('user').then((user) => {
        if (user !== undefined && user !== null) {
          this.user=user;
          this.conectSocket(user._id);
          this.subscriveEvenst((type,data)=>{
            console.log("SocketEvent",type,data)
          })
        }
      });
    });
    platform.pause.subscribe((e) => {
      if (this.socket)
        this.socket.disconnect();
    });

  }

  removeAllEvents(){
    if(this.socket)
    this.socket.removeAllListeners(["user_online","send_message","receive_message","typing_show","typing_stop_show","user_offline","disconnect"])
  }

  subscriveEvenst(cb) {
    this.socket.on('send_message', (msg) => {
      cb("send_message", msg);
    });

    this.socket.on('receive_message', (msg) => {
      cb("receive_message", msg);
    });

    this.socket.on('typing_show', (msg) => {
      cb("typing_show", msg);
    });

    this.socket.on('typing_stop_show', (msg) => {
      cb("typing_stop_show", msg);
    });

    this.socket.on('user_offline', (msg) => {
      cb("user_offline", msg);
    });
    this.socket.on('user_online', (msg) => {
      cb("user_online", msg);
    });
    this.socket.on('disconnect',()=>{
      console.log("disconnect");
    });
  }

  registerEvents(cb) {
    this.subscriveEvenst(cb);
  }

  conectSocket(id) {
    console.log("calling..............")
    let device_id=this.deviceToken?this.config.getConf('device_id'):"TestDevice";
    this.socket = Chat.SocketObj = io(this.config.getConf("socket_url")+'?user_id=' + id+"&device_id="+device_id,{forceNew: true});
    this.socket.on('connect', () => {
      for (let i in this.allSubscribers) {
        if (this.allSubscribers[i])
          this.subscriveEvenst(this.allSubscribers[i]);
      }
      console.log("Connected User");
    });
  }



  sendMessage(data, cb) {
    this.socket.emit('send-message', data, (data) => {
      console.log("data",data);
      cb(data);
    });
  }
  getOnlineStatus(data, cb){
    this.socket.emit('typing', {
      to_id: data.to_id
    }, (data) => {
      cb(data);
    })
  }


  getInbox(data, cb) {
    this.socket.emit('get-message', {userId:this.user._id}, (data) => {
      cb(data);
    })
  }

  getMessageCount(data) {
    this.socket.emit('message_count', {user_id: data.to_id}, (response) => {
      this.config.setConf('unreadMessageCount', response[0].cnt);
      this.events.publish('setMessageCount', response[0].cnt)
    });
  }

  getAllMessages(data, cb) {
    this.helper.httpRequest({url:"get-message",type:"POST",body:data}).subscribe((response: any) => {
      console.log("response",response);
      if (response.status === "true") {
        cb(response.data);
      } else {
        this.helper.toast(response.message);
      }
    });
  }

}
