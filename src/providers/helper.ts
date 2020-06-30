import { NavController,ActionSheetController  } from '@ionic/angular';
import { FormGroup, FormArray } from '@angular/forms';
import { Config } from 'src/providers/Config';
import { FCM } from '@ionic-native/fcm/ngx';
import { Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { from } from 'rxjs';
import { validationService } from '../app/services/validation.service';


@Injectable()
export class CommonHelper {
	loading: any;
	public showErrorCatch = true;
	static consoles = "";
	static toastVar: any = "test";
	static loaderCount: number = 0;
	static loader: any;
	constructor(
		private http: HttpClient,
		private alertCtrl: AlertController,
		private loadingCntrl: LoadingController,
		private Toast: ToastController,
		private config: Config,
		private storage: Storage,
		public navCtrl:NavController,
		private fcm: FCM,
		public validation: validationService,
		public actionSheetController:ActionSheetController
	) {
		console.log("CommonHelper");

	}


	httpRequest(values):Observable<any> {
			// if (values.loader == undefined || values.loader == true) {
			//   if (CommonHelper.loaderCount == 0) {
			// 	CommonHelper.loader = this.showLoading();
			//   }
			//   CommonHelper.loaderCount++;
			// }
			let e = this;
			let response;
			values.url = this.config.getConf("url") + values.url;
			let token = JSON.parse(this.validation.getToken())

			// var token = this.config.getConf("token");
			if (token) values.token = token;
			let headers;
			if (values.token) {
				headers = {
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: values.token,
					}
				};
			} else {
				headers = {
					headers: {
						Accept: "application/json"
                        
					}
				};
			}
			if (values.type == "POST") {
				let formData: FormData = new FormData();
				if (values.body !== "" && values.body !== undefined && values.body !== null) {
					// for (var property in values.body) {
					// 		formData.append(property, values.body[property]);
					// }
				}
				response = this.http.post(values.url, values.body, headers) // ...using post request
			} else if (values.type == "POSTUPLOAD") {
				let formData: FormData = new FormData();
				if (values.body !== "" && values.body !== undefined && values.body !== null) {
					for (var property in values.body) {
						console.log("instanceof",values.body[property] instanceof Array);
						if (values.body[property] instanceof Array) {
							for (var files in values.body[property]) {
								console.log("files",values.body[property][files]);
								formData.append(property + "[]", values.body[property][files]);
							}
						} else
							formData.append(property, values.body[property]);

					}
				}
				response = this.http.post(values.url, formData, headers);
			} else if (values.type == "GET") {
				response = this.http.get(values.url, headers);
			}
			return response.pipe(map(res => {
				let resp:any=res;
				// if (values.loader == undefined || values.loader == true) {
				//   CommonHelper.loaderCount--;
				//   if (CommonHelper.loaderCount <= 0) {
				// 	e.hideLoading(CommonHelper.loader);
				//   }
				// }
				if (values.isBaseurl == undefined || values.isBaseurl == true) {

				  if (resp.status == "false") {
					e.toast(resp.msg);
				  } else if (resp.status == "deactive") {
					this.storage.clear();
					this.navCtrl.navigateRoot(["/login"]);
					e.toast(resp.msg);
				  }
				}
				return resp;
			  }),catchError((error: any) => {



				// if (values.loader == undefined || values.loader == true) {
				//   CommonHelper.loaderCount--;
				//   if (CommonHelper.loaderCount <= 0) {
				// 	e.hideLoading(CommonHelper.loader);
				//   }
				// }

				if (error.status) {
					if(error.error.status=="false"){
						return e.toast(error.error.message);;
					}else{
						return e.toast("Server error");;
					}
				}else{
					return e.toast("Server not responding");;
				}




			  })
			);
	}

	async permissionConfirm(msg: string, callback) {
		let alert = await this.alertCtrl.create({
			header: this.config.getConf('app_name'),
			message: msg,
			buttons: [
				{
					text: 'NOT NOW',
					role: 'cancel',
					handler: () => {
						callback(false)
						console.log('Cancel clicked');
					}
				},
				{
					text: 'SETTINGS',
					handler: () => {
						callback(true);
						console.log('Buy clicked');
					}
				}
			]
		});
		await alert.present();
	}


 async showLoading() {
	const loading:any = await this.loadingCntrl.create({
		mode: "ios"
	});
	return await loading.present();
	// loading;
}

	async hideLoading(loading){
		// await this.loadingCntrl.dismiss(loading);
	}



	async toast(msg) {
		const toast = await this.Toast.create({
			message: msg,
			mode: 'md',
			duration: 3000,
			position: 'bottom',
			cssClass: 'bottomtoast'
		});
		await toast.present();
	}

	async alert(msg: string) {
		let ok = 'Ok';
		let alert = await this.alertCtrl.create({
			header: this.config.getConf("app_name"),
			subHeader: msg,
			buttons: [ok]
		});
		await alert.present();
	}


	async confirm(msg: string, callback) {
		const alert = await this.alertCtrl.create({
			header: 'Confirm!',
			message: msg,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: (blah) => {
						callback(false)
						console.log('Confirm Cancel: blah');
					}
				}, {
					text: 'Okay',
					handler: () => {
						callback(true)
						console.log('Confirm Okay');
					}
				}
			]
		});

		await alert.present();
	}

	setVaidations(form: any, formname?: any, custmMsg?: any): boolean {
		console.log(form,"dfjsdfhjs")
		let formErrors = {};
		let formError = false;
		let msg: string;
		let str: string;
		let validationMsg = {};
		if (formname) {
			for (let i in formname) {
				validationMsg[i] = formname[i]
			}
		}

		for (let i in form.controls) {
			if (form.controls[i] instanceof FormGroup) {
				formError = !this.setVaidations(form.controls[i]);
				if (formError) {
					return !formError;
				}
			} else if (form.controls[i] instanceof FormArray) {
				for (let jj = 0; jj < form.controls[i].controls.length; jj++ ){
					formError = !this.setVaidations(form.controls[i].controls[jj]);
					if (formError) {
						return !formError;
					}
				}
			}
			if (form.controls[i].errors) {
				for (let j in form.controls[i].errors) {
					if (form.controls[i].errors[j]) {
						formError = true;
						msg = "";
						str = "";
						if (validationMsg[i])
							str = validationMsg[i];
						else {
							if (i.indexOf('_') !== -1) {
								str = i.split("_").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(" ");
							} else {
								str = i.charAt(0).toUpperCase() + i.slice(1);

								for (let ii = 1; ii < str.length; ii++) {
									if (str.charAt(ii) >= 'A' && str.charAt(ii) <= 'Z') {
										str = str.substring(0, ii) + " " + str.substr(ii);
										ii = ii + 2;
									}
								}
							}
						}
						if (j == "required") {
							msg = "is required";
						} else if (j == "maxlength") {
							let lrn = form.controls[i].errors[j].requiredLength;
							msg = "should be less than " + (lrn + 1) + " characters";
						} else if (j == "minlength") {
							let lrn = form.controls[i].errors[j].requiredLength;
							msg = "should be greater than " + (lrn - 1) + " characters";
						} else if (j == "pattern") {
							let field = str.toLowerCase().replace(/ /g, '_');
							if (custmMsg[field]) {
								msg = custmMsg[field];
								str = "";
							} else {
								msg = "is Invalid!"
							}
						} else if (j == 'min') {
							if (i == 'price_per_message') {
								str = "";
								msg = "'Price per Message' should be greater than or equal to $1";
							}
						}

						this.toast(str + " " + msg);
						break;
					}
				}
				if (formError) {
					break;
				}
			}

		}
		console.log(form,"dfjsdfhjs")
		return !formError;
	}



	getFcmToken(cb) {
		this.storage.get('fcmtoken').then(token => {
			if (!token) {
				this.fcm.getToken().then(token => {
					this.storage.set('fcmtoken', token);
					this.config.setConf("device_id", token);
					cb(token);

				}).catch(() => {
					cb("NOTFOUND");
				})
			}
			else {
				if (token == "NOTFOUND") {
					this.fcm.getToken().then(token => {
						this.storage.set('fcmtoken', token);
						;
						this.config.setConf("device_id", token);
						cb(token);

					}).catch(() => {
						cb("NOTFOUND");
					})
				} else {
					this.config.setConf("device_id", token);
					cb(token);
				}
			}
		});
	}

	async presentActionSheet(cb) {
		const actionSheet = await this.actionSheetController.create({
	    backdropDismiss:false,
		  buttons: [{
			text: 'Delete',
			role: 'destructive',
			icon: 'trash',
			handler: () => {
				cb(1);
			  console.log('Delete clicked');
			}
		  }, {
			text: 'Rename',
			icon: 'create',
			handler: () => {
				cb(2);
			  console.log('Rename clicked');
			}
		  }, {
			text: 'Cancel',
			icon: 'close',
			role: 'cancel',
			handler: () => {
				cb(false);
			  console.log('Cancel clicked');
			}
		  }]
		});
		await actionSheet.present();
	  }

	  async presentAlertPrompt(cb) {
		const alert = await this.alertCtrl.create({
		  header: 'Customize',
		  animated:true,
		  backdropDismiss:true,
		  inputs: [
			{
			  name: 'customize_label',
			  type: 'text',
			  placeholder: '',
			  id:"customize_label"
			},
		  ],
		  buttons: [
			{
			  text: 'Cancel',
			  role: 'cancel',
			  cssClass: 'secondary',
			  handler: (data) => {
				console.log('Confirm Cancel',data);
				cb(false);
			  }
			}, {
			  text: 'Ok',
			  handler: (data) => {
				console.log('Confirm Ok',);
				cb(data.customize_label);
			  }
			}
		  ]
		});

		await alert.present();
	  }


	  async presentRenameAlertPrompt(cb) {
		const alert = await this.alertCtrl.create({
		  header: 'Rename Folder',
		  animated:true,
		  backdropDismiss:true,
		  inputs: [
			{
			  name: 'customize_label',
			  type: 'text',
			  placeholder: 'Enter here',
			  id:"customize_label"
			},
		  ],
		  buttons: [
			{
			  text: 'Cancel',
			  role: 'cancel',
			  cssClass: 'secondary',
			  handler: (data) => {
				console.log('Confirm Cancel',data);
				cb(false);
			  }
			}, {
			  text: 'Ok',
			  handler: (data) => {
				console.log('Confirm Ok',);
				cb(data.customize_label);
			  }
			}
		  ]
		});

		await alert.present();
	  }
}