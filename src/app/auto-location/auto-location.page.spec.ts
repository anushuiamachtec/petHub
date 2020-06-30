import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutoLocationPage } from './auto-location.page';

describe('AutoLocationPage', () => {
  let component: AutoLocationPage;
  let fixture: ComponentFixture<AutoLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutoLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
