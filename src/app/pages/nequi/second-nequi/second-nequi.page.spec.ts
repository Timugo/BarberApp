import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SecondNequiPage } from './second-nequi.page';

describe('SecondNequiPage', () => {
  let component: SecondNequiPage;
  let fixture: ComponentFixture<SecondNequiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondNequiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondNequiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
