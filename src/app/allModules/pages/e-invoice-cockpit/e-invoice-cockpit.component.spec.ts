import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceCockpitComponent } from './e-invoice-cockpit.component';

describe('EInvoiceCockpitComponent', () => {
  let component: EInvoiceCockpitComponent;
  let fixture: ComponentFixture<EInvoiceCockpitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EInvoiceCockpitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EInvoiceCockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
