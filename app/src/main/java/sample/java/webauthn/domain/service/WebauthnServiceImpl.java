package sample.java.webauthn.domain.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webauthn4j.WebAuthnManager;
import com.webauthn4j.authenticator.Authenticator;
import com.webauthn4j.authenticator.AuthenticatorImpl;
import com.webauthn4j.converter.exception.DataConversionException;
import com.webauthn4j.data.RegistrationData;
import com.webauthn4j.data.RegistrationParameters;
import com.webauthn4j.data.RegistrationRequest;
import com.webauthn4j.data.client.Origin;
import com.webauthn4j.data.client.challenge.Challenge;
import com.webauthn4j.data.client.challenge.DefaultChallenge;
import com.webauthn4j.server.ServerProperty;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.xml.bind.DatatypeConverter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sample.java.webauthn.domain.dto.AllowCredential;
import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.dto.FidoUser;
import sample.java.webauthn.domain.dto.LoginUserDto;
import sample.java.webauthn.domain.dto.Rp;
import sample.java.webauthn.domain.dto.UserAuthenticationOption;
import sample.java.webauthn.domain.dto.UserEntity;
import sample.java.webauthn.domain.dto.ValidateCredentialDto;
import sample.java.webauthn.domain.exception.UserException;
import sample.java.webauthn.domain.repository.UserRepository;
import sample.java.webauthn.domain.util.UuidUtil;

@Service
@Transactional
@Slf4j
public class WebauthnServiceImpl implements WebauthnService {

  @Value("${app.fido.rp.name:FidoSampleApp}")
  private String rpName;

  @Value("${app.fido.rp.id:localhost}")
  private String rpId;

  @Value("${app.fido.origin:http://localhost:8181}")
  private String origin;

  @Autowired private UserRepository userRepository;

  @Autowired ObjectMapper mapper;

  private WebAuthnManager webAuthnManager = WebAuthnManager.createNonStrictWebAuthnManager();

  public UserEntity generateServerMakeCredRequest(CreateUserDto createUserDto) {

    // challenge
    Challenge challengeRaw = new DefaultChallenge(); // Webauthn4J
    log.debug("challengeRaw: {}", Arrays.toString(challengeRaw.getValue()));
    //    String challenge = Base64UrlUtil.encodeToString(challengeRaw.getValue()); //
    // webauthn4j-utilでパディングを行う方法が不明なため。
    String challenge = DatatypeConverter.printBase64Binary(challengeRaw.getValue());

    // userIdをuuid(v4)を元に生成する
    UUID userIdUuid = UUID.randomUUID();
    log.debug("userIdUuid: {}", userIdUuid.toString());
    //    String userId = UuidUtil.uuidToBase64(userIdUuid);
    //    String userId = Base64UrlUtil.encodeToString(UuidUtil.asBytes(userIdUuid)); //
    // webauthn4j-utilでパディングを行う方法が不明なため。
    String userId = DatatypeConverter.printBase64Binary(UuidUtil.asBytes(userIdUuid));

    // UserCreationOptionsのパラメータを組み立てる
    Rp rp = new Rp().builder().name(rpName).id(rpId).build();

    FidoUser user =
        new FidoUser()
            .builder()
            .id(userId)
            .name(createUserDto.getEmail())
            .displayName(createUserDto.getEmail())
            .build();

    UserEntity userEntity =
        new UserEntity()
            .builder()
            .email(createUserDto.getEmail())
            .challenge(challenge)
            .attestation("direct")
            .rp(rp)
            .fidoUser(user)
            .build();

    // DBに保存する
    saveUser(userEntity);
    return userEntity;
  }

  @Override
  public boolean validateCredential(ValidateCredentialDto validateCredentialDto) {
    boolean validateResult = false;
    try {
      // ================================================================
      // 構成証明を検証する
      // ================================================================
      Authenticator authenticator = validateAttestation(validateCredentialDto);

      // ================================================================
      // 公開鍵をDBに登録する
      // ================================================================
      saveAuthenticator(validateCredentialDto.getEmail(), authenticator);

      validateResult = true;
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }
    return validateResult;
  }

  @Override
  public UserAuthenticationOption createUserAuthenticationOption(LoginUserDto loginUserDto) {
    // ================================================================
    // ユーザが登録済みかどうかチェックする
    // ================================================================
    UserEntity userEntity = userRepository.findByEmail(loginUserDto.getEmail());
    if (userEntity == null) {
      throw new UserException("当該のE-mailアドレスは登録されておりません。");
    }

    // ================================================================
    // 新規でchallengeを生成する
    // ================================================================
    Challenge challengeRaw = new DefaultChallenge(); // Webauthn4J
    String challenge = DatatypeConverter.printBase64Binary(challengeRaw.getValue());

    // ================================================================
    // 新規に生成したchallengeをDBに保存する
    // ================================================================
    saveChallenge(loginUserDto.getEmail(), challenge);

    // ================================================================
    // DBに保存されている公開鍵、challngeを使用して、レスポンス用のパラメータを組み立てる
    // ================================================================

    // 例えばWindows Helloを認証機として使う場合、
    // internal「だけ」が下記変数transportsにListの要素として指定されていないとだめのようである。
    // 適用させたい順番があるのかと考え、internalを最初に持ってきてもだめだった。
    //    List<String> transports = new ArrayList<>(Arrays.asList("usb", "nfc", "ble", "internal"));
    //    List<String> transports = new ArrayList<>(Arrays.asList("internal", "usb", "nfc", "ble"));
    List<String> transports = new ArrayList<>(Arrays.asList("internal"));

    AllowCredential allowCredential =
        new AllowCredential()
            .builder()
            .type("public-key")
            .id(userEntity.getFidoUser().getId())
            .transports(transports)
            .build();
    List<AllowCredential> allowCredentials = new ArrayList<>(Arrays.asList(allowCredential));
    UserAuthenticationOption retObj =
        new UserAuthenticationOption()
            .builder()
            .challenge(challenge)
            .allowCredentials(allowCredentials)
            .build();

    return retObj;
  }

  /**
   * challengeをDBに保存する
   *
   * @param email
   * @param challengeBase64
   */
  private void saveChallenge(String email, String challengeBase64) {
    // -------------------------------------
    // 保存
    // -------------------------------------
    int count = userRepository.saveChallenge(email, challengeBase64);
    if (count == 0) {
      throw new UserException("認証情報（チャレンジ）の保存に失敗しました。");
    }
  }

  /**
   * 構成証明を検証する
   *
   * @param validateCredentialDto
   * @return
   */
  private AuthenticatorImpl validateAttestation(ValidateCredentialDto validateCredentialDto)
      throws JsonProcessingException {
    // ================================================================
    // Webauthn4Jにわたすためのパラメータ作成
    // ================================================================
    // --------------------------------------
    // Client properties
    // --------------------------------------
    byte[] attestationObject =
        Base64.decodeBase64(validateCredentialDto.getResponse().getAttestationObject());
    byte[] clientDataJSON =
        Base64.decodeBase64(validateCredentialDto.getResponse().getClientDataJSON());
    String userEmail = validateCredentialDto.getEmail();
    Set<String> transports = new HashSet<>(Arrays.asList("usb", "nfc", "ble", "internal"));

    // --------------------------------------
    // Server properties
    // --------------------------------------
    Origin origin = new Origin(this.origin);
    String rpId = this.rpId;
    Challenge challenge = getPreservedChallenge(userEmail); /* set challenge */

    byte[] tokenBindingId = null /* なし */;
    ServerProperty serverProperty = new ServerProperty(origin, rpId, challenge, tokenBindingId);

    // --------------------------------------
    // expectations
    // --------------------------------------
    boolean userVerificationRequired = false;
    boolean userPresenceRequired = true;
    List<String> expectedExtensionIds = Collections.emptyList();

    // --------------------------------------
    // Webauthn4Jパラメータ組み立て
    // --------------------------------------
    String clientExtensionJSON = null;
    RegistrationRequest registrationRequest =
        new RegistrationRequest(attestationObject, clientDataJSON, clientExtensionJSON, transports);
    RegistrationParameters registrationParameters =
        new RegistrationParameters(
            serverProperty, userVerificationRequired, userPresenceRequired, expectedExtensionIds);
    RegistrationData registrationData;

    // ================================================================
    // Webauthn4Jパラメータパース
    // ================================================================
    try {
      registrationData = webAuthnManager.parse(registrationRequest);
    } catch (DataConversionException e) {
      // If you would like to handle WebAuthn data structure parse error, please catch
      // DataConversionException
      throw e;
    }

    // ================================================================
    // Webauthn4Jによる構成証明の検証
    // ================================================================
    webAuthnManager.validate(registrationData, registrationParameters);

    // ================================================================
    // 保存対象の認証情報作成
    // ================================================================
    // please persist Authenticator object, which will be used in the authentication process.
    return new AuthenticatorImpl( // You may create your own Authenticator implementation to save
        // friendly authenticator name
        registrationData.getAttestationObject().getAuthenticatorData().getAttestedCredentialData(),
        registrationData.getAttestationObject().getAttestationStatement(),
        registrationData.getAttestationObject().getAuthenticatorData().getSignCount());
  }

  private void saveAuthenticator(String userEmail, Authenticator authenticator) {
    // -------------------------------------
    // シリアライズ＆BASE64エンコ
    // -------------------------------------
    byte[] authenticatorBytes = getByteObject(authenticator);
    String authenticatorBase64 = DatatypeConverter.printBase64Binary(authenticatorBytes);

    // -------------------------------------
    // 保存
    // -------------------------------------
    int count = userRepository.saveAuthenticator(userEmail, authenticatorBase64);
    if (count == 0) {
      throw new UserException("認証情報の保存に失敗しました。");
    }
  }

  private Challenge getPreservedChallenge(String userEmail) {
    UserEntity user = userRepository.findByEmail(userEmail);

    if (user == null) {
      throw new UserException("該当するユーザが見つかりませんでした。");
    }

    String challengeBase64Str = user.getChallenge(); // この状態ではBase64エンコード状態
    byte[] challengeBytes = Base64.decodeBase64(challengeBase64Str);
    return new DefaultChallenge(challengeBytes);
  }

  /**
   * ユーザをDBに保存する。
   *
   * @param userEntity ユーザの認証情報
   */
  private void saveUser(UserEntity userEntity) {
    // ユーザが保存済みがどうか確認する
    int userCount = userRepository.countByEmail(userEntity.getEmail());
    if (userCount != 0) {
      throw new UserException("このE-mailアドレスは既に登録されています。");
    }
    userRepository.save(userEntity);
  }

  /**
   * インスタンスをバイト配列に変換
   *
   * @param obj 変換対象インスタンス
   * @return
   */
  public static byte[] getByteObject(Object obj) {
    byte retObject[] = null;
    try {
      ByteArrayOutputStream byteos = new ByteArrayOutputStream();
      ObjectOutputStream objos = new ObjectOutputStream(byteos);
      objos.writeObject(obj);
      objos.close();
      byteos.close();
      retObject = byteos.toByteArray();
    } catch (IOException e) {
      e.printStackTrace();
      throw new RuntimeException("オブジェクトのシリアライズに失敗しました。", e);
    }
    return retObject;
  }
}
