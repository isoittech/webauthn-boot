package sample.java.webauthn.domain.service;

import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.dto.LoginUserDto;
import sample.java.webauthn.domain.dto.UserAuthenticationOption;
import sample.java.webauthn.domain.dto.ValidateCredentialDto;
import sample.java.webauthn.domain.dto.UserEntity;

public interface WebauthnService {
  UserEntity generateServerMakeCredRequest(CreateUserDto createUserDto);

  boolean validateCredential(ValidateCredentialDto validateCredentialDto);

  UserAuthenticationOption createUserAuthenticationOption(LoginUserDto loginUserDto);
}
