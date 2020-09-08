package sample.java.webauthn.app.web;

import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sample.java.webauthn.app.web.form.PublicKeyCredentialRequestForm;
import sample.java.webauthn.app.web.form.UserLoginParameterRequestForm;
import sample.java.webauthn.app.web.form.UserRegisterRequestForm;
import sample.java.webauthn.app.web.response.ResponseData;
import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.dto.LoginUserDto;
import sample.java.webauthn.domain.dto.UserAuthenticationOption;
import sample.java.webauthn.domain.dto.ValidateCredentialDto;
import sample.java.webauthn.domain.dto.UserEntity;
import sample.java.webauthn.domain.service.WebauthnService;

@RestController
@RequestMapping("webauthn")
@Slf4j
public class WebAuthApiController {

  @Autowired private ModelMapper modelMapper;
  @Autowired WebauthnService webauthnService;

  @PostMapping(value = "credential", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseData credential(
      @RequestBody PublicKeyCredentialRequestForm publicKeyCredentialRequestForm,
      BindingResult result) {

    if (result.hasErrors()) {
      throw new RuntimeException("バリデーションエラー発生");
    }

    ValidateCredentialDto validateCredentialDto =
        modelMapper.map(publicKeyCredentialRequestForm, ValidateCredentialDto.class);

    boolean validationResult = webauthnService.validateCredential(validateCredentialDto);
    String validationMessage = null;
    if (validationResult) {
      validationMessage = "構成証明の検証および認証情報の保存に成功しました。";
    } else {
      validationMessage = "構成証明の検証および認証情報の保存に失敗しました。";
    }

    ResponseData responseData =
        new ResponseData().builder().status(HttpStatus.CREATED).data(validationMessage).build();
    return responseData;
  }

  @PostMapping(value = "register/parameter", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseData register(
      @RequestBody UserRegisterRequestForm userRegisterRequestForm,
      BindingResult result,
      HttpServletRequest request) {

    if (result.hasErrors()) {
      throw new RuntimeException("バリデーションエラー発生");
    }

    CreateUserDto createUserDto = new CreateUserDto(userRegisterRequestForm.getEmail());

    UserEntity userEntity = webauthnService.generateServerMakeCredRequest(createUserDto);
    if (userEntity == null) {
      throw new RuntimeException();
    }

    ResponseData responseData =
        new ResponseData().builder().status(HttpStatus.CREATED).data(userEntity).build();
    return responseData;
  }

  @PostMapping(value = "login/parameter", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseData loginParameter(
      @RequestBody UserLoginParameterRequestForm userLoginParameterRequestForm,
      BindingResult result,
      HttpServletRequest request) {

    if (result.hasErrors()) {
      throw new RuntimeException("バリデーションエラー発生");
    }

    LoginUserDto loginUserDto = new LoginUserDto(userLoginParameterRequestForm.getEmail());

    UserAuthenticationOption userAuthenticationOption =
        webauthnService.createUserAuthenticationOption(loginUserDto);
    if (userAuthenticationOption == null) {
      throw new RuntimeException("エラー発生");
    }

    ResponseData responseData =
        new ResponseData()
            .builder()
            .status(HttpStatus.CREATED)
            .data(userAuthenticationOption)
            .build();
    return responseData;
  }
}
