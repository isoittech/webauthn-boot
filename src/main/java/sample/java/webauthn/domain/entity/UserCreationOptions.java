package sample.java.webauthn.domain.entity;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"email", "challenge", "rp", "user", "attestation"})
@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationOptions implements Serializable {

  @JsonProperty("id")
  public Integer id;

  @JsonProperty("email")
  public String email;

  @JsonProperty("challenge")
  public String challenge;

  @JsonProperty("rp")
  public Rp rp;

  @JsonProperty("user")
  public FidoUser fidoUser;

  @JsonProperty("attestation")
  public String attestation;

  @JsonIgnore
  private final Map<String, Object> additionalProperties = new HashMap<String, Object>();

  private static final long serialVersionUID = -2380232359442495568L;

  @JsonAnyGetter
  public Map<String, Object> getAdditionalProperties() {
    return this.additionalProperties;
  }

  @JsonAnySetter
  public void setAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
  }

  public UserCreationOptions withAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
    return this;
  }
}
