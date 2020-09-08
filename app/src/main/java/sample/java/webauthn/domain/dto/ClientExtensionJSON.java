package sample.java.webauthn.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class ClientExtensionJSON {
  private String email;
}
