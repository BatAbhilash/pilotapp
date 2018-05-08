import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CslDropdownsComponent } from './csl-dropdowns.component';

describe('CslDropdownsComponent', () => {
  let component: CslDropdownsComponent;
  let fixture: ComponentFixture<CslDropdownsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CslDropdownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CslDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
