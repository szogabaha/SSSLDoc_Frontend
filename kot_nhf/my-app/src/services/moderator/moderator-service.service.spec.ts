import { TestBed } from '@angular/core/testing';

import { ModeratorServiceService } from './moderator-service.service';

describe('ModeratorServiceService', () => {
  let service: ModeratorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeratorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
