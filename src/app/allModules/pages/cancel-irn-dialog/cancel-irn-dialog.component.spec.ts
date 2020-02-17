import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelIrnDialogComponent } from './cancel-irn-dialog.component';

describe('CancelIrnDialogComponent', () => {
  let component: CancelIrnDialogComponent;
  let fixture: ComponentFixture<CancelIrnDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelIrnDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelIrnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
