package sample.java.webauthn.domain.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"challenge", "allowCredentials"})
@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAuthenticationOption implements Serializable {

  @JsonProperty("challenge")
  private String challenge;

  @JsonProperty("allowCredentials")
  private List<AllowCredential> allowCredentials = null;

  @JsonIgnore private Map<String, Object> additionalProperties = new HashMap<String, Object>();
  private static final long serialVersionUID = 4111387191468716792L;

  @JsonAnyGetter
  public Map<String, Object> getAdditionalProperties() {
    return this.additionalProperties;
  }

  @JsonAnySetter
  public void setAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
  }

  public UserAuthenticationOption withAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
    return this;
  }
}
