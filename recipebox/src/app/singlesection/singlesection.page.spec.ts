import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglesectionPage } from './singlesection.page';

describe('SinglesectionPage', () => {
  let component: SinglesectionPage;
  let fixture: ComponentFixture<SinglesectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SinglesectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
