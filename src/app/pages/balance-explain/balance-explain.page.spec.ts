import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BalanceExplainPage } from './balance-explain.page';

describe('BalanceExplainPage', () => {
  let component: BalanceExplainPage;
  let fixture: ComponentFixture<BalanceExplainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceExplainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceExplainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
