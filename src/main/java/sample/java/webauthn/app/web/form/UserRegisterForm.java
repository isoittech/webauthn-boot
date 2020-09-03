package sample.java.webauthn.app.web.form;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterForm {

  @NotBlank
  @Email
  private String email;


  @NotNull
  private String userHandle;
}
