import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllrecipesPage } from './allrecipes.page';

describe('AllrecipesPage', () => {
  let component: AllrecipesPage;
  let fixture: ComponentFixture<AllrecipesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllrecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
