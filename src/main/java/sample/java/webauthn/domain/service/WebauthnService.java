package sample.java.webauthn.domain.service;

import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.dto.ValidateCredentialDto;
import sample.java.webauthn.domain.entity.UserEntity;

public interface WebauthnService {
  UserEntity generateServerMakeCredRequest(CreateUserDto createUserDto);

  boolean validateCredential(ValidateCredentialDto validateCredentialDto);
}
