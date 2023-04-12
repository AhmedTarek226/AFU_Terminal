import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchauditComponent } from './searchaudit.component';

describe('SearchauditComponent', () => {
  let component: SearchauditComponent;
  let fixture: ComponentFixture<SearchauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchauditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
