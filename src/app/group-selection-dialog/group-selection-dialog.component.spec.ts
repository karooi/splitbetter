import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSelectionDialogComponent } from './group-selection-dialog.component';

describe('GroupSelectionDialogComponent', () => {
  let component: GroupSelectionDialogComponent;
  let fixture: ComponentFixture<GroupSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSelectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
