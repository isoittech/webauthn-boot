package sample.java.webauthn.app.web.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("sample.java.webauthn")
public class AppBeanConfig {
  @Bean
  public ModelMapper modelMapper() {
    return new ModelMapper();
  }
}
