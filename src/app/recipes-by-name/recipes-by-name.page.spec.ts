import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecipesByNamePage } from './recipes-by-name.page';

describe('RecipesByNamePage', () => {
  let component: RecipesByNamePage;
  let fixture: ComponentFixture<RecipesByNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesByNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipesByNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
