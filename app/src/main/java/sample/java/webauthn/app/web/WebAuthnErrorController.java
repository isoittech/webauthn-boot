package sample.java.webauthn.app.web;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.ModelAndView;

/**
 * Web アプリケーション全体のエラーコントローラー。 ErrorController インターフェースの実装クラス。
 */
@Controller
@RequestMapping("/error") // エラーページへのマッピング
public class WebAuthnErrorController implements ErrorController {

  /**
   * エラーページのパスを返す。
   *
   * @return エラーページのパス
   */
  @Override
  public String getErrorPath() {
    return "/error";
  }

  /**
   * エラー情報を抽出する。
   *
   * @param req リクエスト情報
   * @return エラー情報
   */
  private static Map<String, Object> getErrorAttributes(HttpServletRequest req) {
    // DefaultErrorAttributes クラスで詳細なエラー情報を取得する
    ServletWebRequest swr = new ServletWebRequest(req);
    DefaultErrorAttributes dea = new DefaultErrorAttributes(true);
    return dea.getErrorAttributes(swr, true);
  }

  /**
   * レスポンス用の HTTP ステータスを決める。
   *
   * @param req リクエスト情報
   * @return レスポンス用 HTTP ステータス
   */
  private static HttpStatus getHttpStatus(HttpServletRequest req) {
    // HTTP ステータスを決める
    // ここでは 404 以外は全部 500 にする
    Object statusCode = req.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
    HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (statusCode != null && statusCode.toString().equals("404")) {
      status = HttpStatus.NOT_FOUND;
    }
    return status;
  }

  /**
   * HTML レスポンス用の ModelAndView オブジェクトを返す。
   *
   * @param req リクエスト情報
   * @param mav レスポンス情報
   * @return HTML レスポンス用の ModelAndView オブジェクト
   */
  @RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
  public ModelAndView myErrorHtml(HttpServletRequest req, ModelAndView mav) {

    // エラー情報を取得
    Map<String, Object> attr = getErrorAttributes(req);

    // HTTP ステータスを決める
    HttpStatus status = getHttpStatus(req);

    // HTTP ステータスをセットする
    mav.setStatus(status);

    // ビュー名を指定する
    // Thymeleaf テンプレートの場合は src/main/resources/templates/error.html
    mav.setViewName("error");

    // 出力したい情報をセットする
    mav.addObject("status", status.value());
    mav.addObject("timestamp", attr.get("timestamp"));
    mav.addObject("error", attr.get("error"));
    mav.addObject("exception", attr.get("exception"));
    mav.addObject("message", attr.get("message"));
    mav.addObject("errors", attr.get("errors"));
    mav.addObject("trace", attr.get("trace"));
    mav.addObject("path", attr.get("path"));

    return mav;
  }

  /**
   * JSON レスポンス用の ResponseEntity オブジェクトを返す。
   *
   * @param req リクエスト情報
   * @return JSON レスポンス用の ResponseEntity オブジェクト
   */
  @RequestMapping
  public ResponseEntity<Map<String, Object>> myErrorJson(HttpServletRequest req) {

    // エラー情報を取得
    Map<String, Object> attr = getErrorAttributes(req);

    // HTTP ステータスを決める
    HttpStatus status = getHttpStatus(req);

    // 出力したい情報をセットする
    Map<String, Object> body = new HashMap();
    body.put("status", status.value());
    body.put("timestamp", attr.get("timestamp"));
    body.put("error", attr.get("error"));
    body.put("exception", attr.get("exception"));
    body.put("message", attr.get("message"));
    body.put("errors", attr.get("errors"));
    body.put("trace", attr.get("trace"));
    body.put("path", attr.get("path"));

    // 情報を JSON で出力する
    return new ResponseEntity<>(body, status);
  }
}