import { TestBed } from '@angular/core/testing';

import { SplitwiseService } from './splitwise.service';

describe('SplitwiseService', () => {
  let service: SplitwiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitwiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
