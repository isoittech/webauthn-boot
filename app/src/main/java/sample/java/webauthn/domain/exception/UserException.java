package sample.java.webauthn.domain.exception;

import org.springframework.security.core.AuthenticationException;

public class UserException extends AuthenticationException {

  public UserException(String message, Throwable cause) {
    super(message, cause);
  }

  public UserException(String message) {
    super(message);
  }
}
