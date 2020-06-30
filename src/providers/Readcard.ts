import {Injectable} from '@angular/core';
declare var google;
@Injectable()

export class Readcard {
  static data:any={}
  constructor() {
  }
  // extractOcrData(){
  //   Promise.all([this.extractEmail(),this.extractContact()]).then(function(values) {
  //     console.log(values);
  //   });
  // }

  extractEmail(str: any) {
    const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    const {matches, cleanedText} = this.removeByRegex(str, emailRegex);
    return matches;
  };

  extractContact(str: any) {
    const contactRegex = /(?:(\+?\d{1,3}) )?(?:([\(]?\d+[\)]?)[ -])?(\d{1,5}[\- ]?\d{1,5})/;
    const {matches, cleanedText} = this.removeByRegex(str, contactRegex);
    return matches;
  }

  removeByRegex(str, regex) {
    const matches = [];
    const cleanedText = str.filter(line => {
      const hits = line.description.match(regex);
      console.log("hits",hits);
      if (hits != null) {
        if(!matches.includes(hits[0])){
        matches.push(hits[0]);
        return false;
        }
        return true;
      }
      return true;
    });
    console.log(matches);
    return {matches, cleanedText};
  };

}
