import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecipesTotTimePage } from './recipes-tot-time.page';

describe('RecipesTotTimePage', () => {
  let component: RecipesTotTimePage;
  let fixture: ComponentFixture<RecipesTotTimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesTotTimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipesTotTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
