package sample.java.webauthn.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class Response {
  private String attestationObject;
  private String clientDataJSON;
}
