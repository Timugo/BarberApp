import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BalanceChargeExplaiPage } from './balance-charge-explai.page';

describe('BalanceChargeExplaiPage', () => {
  let component: BalanceChargeExplaiPage;
  let fixture: ComponentFixture<BalanceChargeExplaiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceChargeExplaiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceChargeExplaiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
