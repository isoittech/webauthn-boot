package sample.java.webauthn.app.web.response;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize.Inclusion;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class ApiError {

  private final String code;

  private final String message;

  @JsonSerialize(include = Inclusion.NON_EMPTY)
  private final String target;

  @JsonSerialize(include = Inclusion.NON_EMPTY)
  private final List<ApiError> details = new ArrayList<>();

  public ApiError(String code, String message) {
    this(code, message, null);
  }

  public ApiError(String code, String message, String target) {
    this.code = code;
    this.message = message;
    this.target = target;
  }

  public String getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public String getTarget() {
    return target;
  }

  public List<ApiError> getDetails() {
    return details;
  }

  public void addDetail(ApiError detail) {
    details.add(detail);
  }
}
