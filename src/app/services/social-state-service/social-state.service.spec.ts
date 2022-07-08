import { TestBed } from '@angular/core/testing';

import { SocialStateService } from './social-state.service';

describe('SocialStateService', () => {
  let service: SocialStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
