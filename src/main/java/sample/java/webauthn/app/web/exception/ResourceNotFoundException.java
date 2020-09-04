package sample.java.webauthn.app.web.exception;

public class ResourceNotFoundException extends RuntimeException {
  /**
   * Constructs an {@code AuthenticationException} with the specified message and root cause.
   *
   * @param msg the detail message
   * @param t the root cause
   */
  public ResourceNotFoundException(String msg, Throwable t) {
    super(msg, t);
  }

  /**
   * Constructs an {@code AuthenticationException} with the specified message and no root cause.
   *
   * @param msg the detail message
   */
  public ResourceNotFoundException(String msg) {
    super(msg);
  }
}
