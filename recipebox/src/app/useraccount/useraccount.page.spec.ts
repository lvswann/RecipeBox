import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UseraccountPage } from './useraccount.page';

describe('UseraccountPage', () => {
  let component: UseraccountPage;
  let fixture: ComponentFixture<UseraccountPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UseraccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
