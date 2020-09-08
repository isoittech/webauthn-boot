package sample.java.webauthn.app.web.form;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PublicKeyCredentialRequestForm {

  @NotBlank private String id;
  @NotBlank private String rawId;
  @NotBlank private String type;
  @NotBlank private String email;
  @Valid @NotBlank private Response response;
  private ClientExtensionJSON clientExtensionJSON;

  @Data
  @ToString
  @AllArgsConstructor
  @NoArgsConstructor
  class Response {
    @NotBlank private String attestationObject;
    @NotBlank private String clientDataJSON;
  }

  @Data
  @ToString
  @AllArgsConstructor
  @NoArgsConstructor
  class ClientExtensionJSON {
    @NotBlank private String email;
  }
}
