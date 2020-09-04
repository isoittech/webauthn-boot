package sample.java.webauthn.app.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("webauthn")
@Slf4j
public class WebAuthController {
  @GetMapping("register")
  public String register(Model model) {
    return "webAuthRegister";
  }
}
