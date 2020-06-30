import { NineTemplate } from './../app/ninetemplate/ninetemplate';
import {NgModule, Pipe, PipeTransform, Directive, ElementRef, HostListener, Input, Output, EventEmitter,HostBinding } from '@angular/core';
import {Config} from '../providers/Config';
import {CommonHelper} from '../providers/helper';
import * as moment from "moment";
import {IonicModule, IonInput} from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Directive({
	selector: '[myTabindex]'
})
export class TabindexDirective {
	constructor(private inputRef: IonInput) {
        this.inputRef = inputRef;

        console.log("tab index working")
	}
	@HostListener('keydown', ['$event']) onInputChange(e) {
        var code = e.keyCode || e.which;
        console.log("myTabindex",e);
		if (code === 13) {
            let element = e.srcElement.nextElementSibling;
            e.preventDefault();
            console.log("myTabindex")
		}
	}
}

@Directive({ selector: '[long-press]' })
export class LongPress {

  @Input() duration: number = 500;

  @Output() onLongPress: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressing: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressEnd: EventEmitter<any> = new EventEmitter();

  private pressing: boolean;
  private longPressing: boolean;
  private timeout: any;
  private mouseX: number = 0;
  private mouseY: number = 0;

  @HostBinding('class.press')
  get press() { return this.pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this.longPressing; }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    // don't do right/middle clicks
    if(event.which !== 1) return;

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    this.pressing = true;
    this.longPressing = false;

    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
      this.loop(event);
    }, this.duration);

    this.loop(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if(this.pressing && !this.longPressing) {
      const xThres = (event.clientX - this.mouseX) > 10;
      const yThres = (event.clientY - this.mouseY) > 10;
      if(xThres || yThres) {
        this.endPress();
      }
    }
  }

  loop(event) {
    if(this.longPressing) {
      this.timeout = setTimeout(() => {
        this.onLongPressing.emit(event);
        this.loop(event);
      }, 50);
    }
  }

  endPress() {
    clearTimeout(this.timeout);
    this.longPressing = false;
    this.pressing = false;
    this.onLongPressEnd.emit(true);
  }

  @HostListener('mouseup')
  onMouseUp() { this.endPress(); }

}




@Pipe({name: 'ImageUrl'})
export class ImageUrl implements PipeTransform {

    constructor(private config: Config) {

    }

    transform(value: string, params): string {
        if (!value) {
            return params || 'assets/images/johns.png';
        }

        else if (value && value.startsWith("data"))
            return value;
            return this.config.getConf('img_url') + value;
    }
}


@Pipe({ name: 'DateFormat'})
export class DateFormat implements PipeTransform{
  constructor(private config: Config){

  }
  transform(value: any): any {
    return moment(value).format("MM-DD-YYYY")
  }
}



@NgModule({
    declarations: [
        ImageUrl,
        NineTemplate,
        DateFormat,
        TabindexDirective,
        LongPress,
    ],
    imports: [
      CommonModule,
      IonicModule
    ],
    entryComponents: [],
    exports: [
        ImageUrl,
        NineTemplate,
        DateFormat,
        TabindexDirective,
        LongPress,
    ]
})
export class SharedModule {
}
