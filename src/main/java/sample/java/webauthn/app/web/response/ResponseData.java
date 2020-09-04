package sample.java.webauthn.app.web.response;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseData implements Serializable {

  /**
   * ステータスコード
   */
  HttpStatus status;

  /**
   * メッセージ
   */

  String message;

  /**
   * レスポンスデータ
   */
  Object data;

}
