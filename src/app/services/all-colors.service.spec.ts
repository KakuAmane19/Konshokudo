import { TestBed } from '@angular/core/testing';

import { AllColorsService } from './all-colors.service';

describe('AllColorsService', () => {
  let service: AllColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
