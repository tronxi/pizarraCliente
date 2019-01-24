import { TestBed } from '@angular/core/testing';

import { DatosUsuarioService } from './datos-usuario.service';

describe('DatosUsuarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatosUsuarioService = TestBed.get(DatosUsuarioService);
    expect(service).toBeTruthy();
  });
});
