import { TestBed, inject } from '@angular/core/testing';

import { CslService } from './csl.service';

describe('CslService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CslService]
    });
  });

  it('should be created', inject([CslService], (service: CslService) => {
    expect(service).toBeTruthy();
  }));
});
