import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitSelectionDialogComponent } from './split-selection-dialog.component';

describe('SplitSelectionDialogComponent', () => {
  let component: SplitSelectionDialogComponent;
  let fixture: ComponentFixture<SplitSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitSelectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
