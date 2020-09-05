package sample.java.webauthn.app.web;

import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sample.java.webauthn.app.web.form.UserRegisterRequestForm;
import sample.java.webauthn.app.web.response.ResponseData;
import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.entity.UserCreationOptions;
import sample.java.webauthn.domain.service.WebauthnService;

@RestController
@RequestMapping("webauthn")
@Slf4j
public class WebAuthApiController {

  @Autowired WebauthnService webauthnService;

  @PostMapping(value = "register", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseData register(
      @RequestBody UserRegisterRequestForm userRegisterRequestForm,
      BindingResult result,
      HttpServletRequest request) {

    if (result.hasErrors()) {
      throw new RuntimeException("バリデーションエラー発生");
    }

    CreateUserDto createUserDto = new CreateUserDto(userRegisterRequestForm.getEmail());

    UserCreationOptions userCreationOptions =
        webauthnService.generateServerMakeCredRequest(createUserDto);
    if (userCreationOptions == null) {
      throw new RuntimeException();
    }
    userCreationOptions.getRp().setId(request.getServerName());

    ResponseData responseData =
        new ResponseData().builder().status(HttpStatus.CREATED).data(userCreationOptions).build();
    return responseData;

    //
    //      WebAuthnRegistrationRequestValidationResponse registrationRequestValidationResponse;
    //      try {
    //        registrationRequestValidationResponse = registrationRequestValidator.validate(
    //            request,
    //            userCreateForm.getAuthenticator().getClientDataJSON(),
    //            userCreateForm.getAuthenticator().getAttestationObject(),
    //            userCreateForm.getAuthenticator().getTransports(),
    //            userCreateForm.getAuthenticator().getClientExtensions()
    //        );
    //      } catch (WebAuthnException | WebAuthnAuthenticationException e) {
    //        model.addAttribute("errorMessage",
    //            "Authenticator registration request validation failed. Please try again.");
    //        logger.debug("WebAuthn registration request validation failed.", e);
    //        return VIEW_SIGNUP_SIGNUP;
    //      }
    //
    //      String username = userCreateForm.getUsername();
    //      String password = passwordEncoder.encode(userCreateForm.getPassword());
    //      boolean singleFactorAuthenticationAllowed = userCreateForm
    //          .isSingleFactorAuthenticationAllowed();
    //      List<GrantedAuthority> authorities;
    //      if (singleFactorAuthenticationAllowed) {
    //        authorities = Collections
    //            .singletonList(new SimpleGrantedAuthority("SINGLE_FACTOR_AUTHN_ALLOWED"));
    //      } else {
    //        authorities = Collections.emptyList();
    //      }
    //      User user = new User(username, password, authorities);
    //
    //      WebAuthnAuthenticator authenticator = new WebAuthnAuthenticatorImpl(
    //          "authenticator",
    //          user,
    //          registrationRequestValidationResponse.getAttestationObject().getAuthenticatorData()
    //              .getAttestedCredentialData(),
    //
    // registrationRequestValidationResponse.getAttestationObject().getAttestationStatement(),
    //          registrationRequestValidationResponse.getAttestationObject().getAuthenticatorData()
    //              .getSignCount(),
    //          registrationRequestValidationResponse.getTransports(),
    //          registrationRequestValidationResponse.getRegistrationExtensionsClientOutputs(),
    //          registrationRequestValidationResponse.getAttestationObject().getAuthenticatorData()
    //              .getExtensions()
    //      );
    //
    //      try {
    //        userDetailsManager.createUser(user);
    //        webAuthnAuthenticatorManager.createAuthenticator(authenticator);
    //      } catch (IllegalArgumentException ex) {
    //        model.addAttribute("errorMessage",
    //            "Registration failed. The user may already be registered.");
    //        logger.debug("Registration failed.", ex);
    //        return VIEW_SIGNUP_SIGNUP;
    //      }
    //    } catch (RuntimeException ex) {
    //      model.addAttribute("errorMessage", "Registration failed by unexpected error.");
    //      logger.debug("Registration failed.", ex);
    //      return VIEW_SIGNUP_SIGNUP;
    //    }
    //
    //    redirectAttributes.addFlashAttribute("successMessage", "User registration finished.");
    //    return REDIRECT_LOGIN;
  }
}
