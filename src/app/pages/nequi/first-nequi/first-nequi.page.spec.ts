import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirstNequiPage } from './first-nequi.page';

describe('FirstNequiPage', () => {
  let component: FirstNequiPage;
  let fixture: ComponentFixture<FirstNequiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstNequiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstNequiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
