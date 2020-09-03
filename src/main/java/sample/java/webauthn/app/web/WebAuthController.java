package sample.java.webauthn.app.web;

import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import sample.java.webauthn.app.web.form.UserRegisterForm;

@Controller
@RequestMapping("webauthn")
public class WebAuthController {

  private final Log logger = LogFactory.getLog(getClass());

  @GetMapping
  public String input(UserRegisterForm form, Model model) {

    return "webAuthRegister";
  }

  @ModelAttribute
  public void addAttributes(Model model, HttpServletRequest request) {
//    Challenge challenge = challengeRepository.loadOrGenerateChallenge(request);
//    model.addAttribute("webAuthnChallenge", Base64UrlUtil.encodeToString(challenge.getValue()));
//    model.addAttribute("webAuthnCredentialIds", getCredentialIds());
  }


  @GetMapping(value = "signup")
  public String template(Model model) {
    UserRegisterForm userRegisterForm = new UserRegisterForm();
    UUID userHandle = UUID.randomUUID();
//    String userHandleStr = Base64UrlUtil.encodeToString(UUIDUtil.convertUUIDToBytes(userHandle));
//    userRegisterForm.setUserHandle(userHandleStr);
    model.addAttribute("userRegisterForm", userRegisterForm);
//    return VIEW_SIGNUP_SIGNUP;
    return "webAuthRegister";
  }

  @PostMapping(value = "signup")
  public String create(HttpServletRequest request,
      @Valid @ModelAttribute("userRegisterForm") UserRegisterForm userCreateForm,
      BindingResult result,
      Model model, RedirectAttributes redirectAttributes) {
//
//    try {
    if (result.hasErrors()) {
      model.addAttribute("errorMessage", "Your input needs correction.");
      logger.debug("User input validation failed.");
      return "webAuthRegister";
//        return VIEW_SIGNUP_SIGNUP;
    }
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
//          registrationRequestValidationResponse.getAttestationObject().getAttestationStatement(),
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
    return "webAuthRegister";
  }


}
