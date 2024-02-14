import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsectionPage } from './newsection.page';

describe('NewsectionPage', () => {
  let component: NewsectionPage;
  let fixture: ComponentFixture<NewsectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewsectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
