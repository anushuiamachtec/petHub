import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { validationService } from '../services/validation.service';
@Injectable({
  providedIn: 'root',
})

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class commonService {
  url = 'http://52.66.252.162:3000/api';
  constructor(
    private http: HttpClient,
    public validation: validationService,
  ) { }

  post(endpoint: string, body: any, isHederSend: boolean) {
    let token = JSON.parse(this.validation.getToken());
    
    if (isHederSend) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
      return this.http.post(this.url + '/' + endpoint, body, { headers });

    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
      console.log(endpoint, headers,"dfhhsdfhdshk")

      return this.http.post(this.url + '/' + endpoint, body, { headers });
    }
  }
  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }
  put(endpoint: string, body: any, reqOpts?: any) {
    let token = JSON.parse(this.validation.getToken());
    console.log(token)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': token, 'access_token': token });
    console.log(this.url + '/' + endpoint, body, { headers },"kjsdfhjkdhgjk")
    return this.http.put(this.url + '/' + endpoint, body, { headers });
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }
 
}

