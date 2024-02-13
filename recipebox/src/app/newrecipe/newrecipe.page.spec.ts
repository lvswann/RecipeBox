import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewrecipePage } from './newrecipe.page';

describe('NewrecipePage', () => {
  let component: NewrecipePage;
  let fixture: ComponentFixture<NewrecipePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewrecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
