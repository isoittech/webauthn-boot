package sample.java.webauthn.domain.service;

import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.entity.UserCreationOptions;

public interface WebauthnService {
  UserCreationOptions generateServerMakeCredRequest(CreateUserDto createUserDto);
}
