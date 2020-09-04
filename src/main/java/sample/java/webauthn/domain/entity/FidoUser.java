package sample.java.webauthn.domain.entity;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "name",
    "displayName"
})
@ToString
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FidoUser implements Serializable {

  @JsonProperty("id")
  public String id;
  @JsonProperty("name")
  public String name;
  @JsonProperty("displayName")
  public String displayName;
  @JsonIgnore
  private final Map<String, Object> additionalProperties = new HashMap<String, Object>();
  private final static long serialVersionUID = 1254613525150473634L;

  @JsonAnyGetter
  public Map<String, Object> getAdditionalProperties() {
    return this.additionalProperties;
  }

  @JsonAnySetter
  public void setAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
  }

  public FidoUser withAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
    return this;
  }

}
