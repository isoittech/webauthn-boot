package sample.java.webauthn.app.web.form;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequestForm {

  @NotBlank
  @Email
  private String email;
}
