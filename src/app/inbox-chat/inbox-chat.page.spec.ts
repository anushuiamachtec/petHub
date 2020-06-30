import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InboxChatPage } from './inbox-chat.page';

describe('InboxChatPage', () => {
  let component: InboxChatPage;
  let fixture: ComponentFixture<InboxChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboxChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InboxChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
