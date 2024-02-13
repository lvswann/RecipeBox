import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglerecipePage } from './singlerecipe.page';

describe('SinglerecipePage', () => {
  let component: SinglerecipePage;
  let fixture: ComponentFixture<SinglerecipePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SinglerecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
