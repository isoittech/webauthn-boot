package sample.java.webauthn.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ValidateCredentialDto {
  private String id;
  private String rawId;
  private String type;
  private Response response;
  private String email;
}
