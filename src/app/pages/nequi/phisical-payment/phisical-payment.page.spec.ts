import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhisicalPaymentPage } from './phisical-payment.page';

describe('PhisicalPaymentPage', () => {
  let component: PhisicalPaymentPage;
  let fixture: ComponentFixture<PhisicalPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhisicalPaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhisicalPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
