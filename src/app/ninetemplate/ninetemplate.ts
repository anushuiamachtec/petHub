import { Component,Input,EventEmitter,Output,ChangeDetectorRef} from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { CommonHelper  } from '../../providers/helper';



@Component({
  selector: 'nine-template',
  templateUrl: 'ninetemplate.html'
})
export class NineTemplate {
  public data;
  public page=1;
  public intrvl;
  public networkErr=false;
  public refresh=false;
  public noRecordFound=false;
  public pagingDataCmp=[];
  public retryCount=0;
  @Input() isPaginate=true;
  public loader=false;
  public dataMore=true;
  public _requestObj={url:"",mapTo:"",showFalseMsg:false,loader:false,original_url:"",dataKey:"",showNetworkErr:true};
  @Output() onComplete = new EventEmitter();


  @Input()
  set request(requestObj ){

    this._requestObj = requestObj;
    this.page=1;
    this.pagingDataCmp=[];
    this.dataMore=false
    this.networkErr=false;
    this.refresh=false;
    this.noRecordFound=false;
    this.getDataList();

  }
  get request() { return this._requestObj; }

  @Input() itemKey:Array<object>;
  @Output() itemKeyChange = new EventEmitter();

 public  your_txt;
constructor(public helper:CommonHelper,private cd: ChangeDetectorRef,public modalCtrl:ModalController) {}


  getDataList(ev?){

    console.log("ev",ev);

    if(!this._requestObj.url){
      return 1;
    }
    let _requestObj=this._requestObj;
    this._requestObj.loader=false;
    this._requestObj.showNetworkErr=true;
    this._requestObj.showFalseMsg=false;
    this.loader=true;
    if(!this._requestObj.original_url)
      this._requestObj.original_url=this._requestObj.url;

    this._requestObj.url=this._requestObj.original_url+"?page="+this.page;
    let lastUrl=this._requestObj;

    console.log(this._requestObj);
    this.helper.httpRequest(this._requestObj).subscribe(data => {


      this.loader=false;
      this.refresh=false;
      this.networkErr=false;
      let pagingData={data:[],last_page:0,status:""};
      this.onRequestComplete(data);
      if(this._requestObj.dataKey){
        pagingData=this.getDescendantProp(data,this._requestObj.dataKey);
      }
      else{

        if(this.isPaginate) {
          if(data.data)
            pagingData = data.data;

        }
        else{
          pagingData = data;
        }
      }
     if(this.isPaginate) {
       if (pagingData.last_page <= this.page) {
         this.dataMore = false;
       }
       else{
         this.dataMore = true;
       }
     }
     else{
       this.dataMore = false;
     }
      if(this.page==1){
          this.pagingDataCmp=[];
      }
      if(pagingData.data && pagingData.data.length>0) {
          this.pagingDataCmp = this.pagingDataCmp.concat(pagingData.data);
      }
      if(!pagingData.data || this.pagingDataCmp.length<=0){
        this.noRecordFound=true;
      }
      else{
          this.noRecordFound=false;
      }
        this.itemKeyChange.emit(this.pagingDataCmp);
      if(ev) ev.target.complete();
      this.cd.detectChanges();
    },err=>{
      console.log('err',err);
      if(ev) ev.target.complete();

      if(this.page==1)
        this.itemKeyChange.emit(this.pagingDataCmp);
      this.loader=false;
      this.refresh=false;
      this.retryCount=5;
      if(this.intrvl){
        clearInterval(this.intrvl);
      }
      this.intrvl= setInterval(()=>{
            this.retryCount--;
            if(this.retryCount==0){
              this.retry();
              this.retryCount=5;
            }
        },1000)
        this.networkErr=true;
    })
  }
  getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
  }

  reload(ev){
    this.refresh=true;
    this.dataMore=true;

    this.pagingDataCmp=[];
    this.page=1;
      this.getDataList(ev);

  }
  loadMore(ev){
    this.page=this.page+1;
    this.getDataList(ev);
  }
  retry(){
    if(this.intrvl)
      clearInterval(this.intrvl)
    this.getDataList();
  }
  onRequestComplete(data){
    this.onComplete.emit(data);
  }




}


