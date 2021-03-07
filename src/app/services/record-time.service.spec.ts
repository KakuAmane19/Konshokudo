import { TestBed } from '@angular/core/testing';

import { RecordTimeService } from './record-time.service';

describe('RecordTimeService', () => {
  let service: RecordTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
