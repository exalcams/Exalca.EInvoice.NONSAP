import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceAuditComponent } from './e-invoice-audit.component';

describe('EInvoiceAuditComponent', () => {
  let component: EInvoiceAuditComponent;
  let fixture: ComponentFixture<EInvoiceAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EInvoiceAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EInvoiceAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
