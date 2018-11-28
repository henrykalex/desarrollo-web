import { TestBed, inject } from '@angular/core/testing';

import { UserLinkService } from './user-link.service';

describe('UserLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserLinkService]
    });
  });

  it('should be created', inject([UserLinkService], (service: UserLinkService) => {
    expect(service).toBeTruthy();
  }));
});
