package sample.java.webauthn.domain.service;

import com.webauthn4j.data.client.challenge.Challenge;
import com.webauthn4j.data.client.challenge.DefaultChallenge;
import java.util.Arrays;
import java.util.UUID;
import javax.xml.bind.DatatypeConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sample.java.webauthn.domain.dto.CreateUserDto;
import sample.java.webauthn.domain.entity.FidoUser;
import sample.java.webauthn.domain.entity.Rp;
import sample.java.webauthn.domain.entity.UserCreationOptions;
import sample.java.webauthn.domain.exception.UserException;
import sample.java.webauthn.domain.repository.UserRepository;
import sample.java.webauthn.domain.util.UuidUtil;

@Service
@Transactional
@Slf4j
public class WebauthnServiceImpl implements WebauthnService {

  @Value("${app.fido.rp_name:FidoSampleApp}")
  private String rpName;

  @Autowired private UserRepository userRepository;

  public UserCreationOptions generateServerMakeCredRequest(CreateUserDto createUserDto) {

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
    Rp rp = new Rp().builder().name(rpName).build();

    FidoUser user =
        new FidoUser()
            .builder()
            .id(userId)
            .name(createUserDto.getEmail())
            .displayName(createUserDto.getEmail())
            .build();

    UserCreationOptions userCreationOptions =
        new UserCreationOptions()
            .builder()
            .email(createUserDto.getEmail())
            .challenge(challenge)
            .attestation("direct")
            .rp(rp)
            .fidoUser(user)
            .build();

    // DBに保存する
    saveUser(userCreationOptions);
    return userCreationOptions;
  }

  /**
   * ユーザをDBに保存する。
   *
   * @param userCreationOptions ユーザの認証情報
   */
  private void saveUser(UserCreationOptions userCreationOptions) {
    // ユーザが保存済みがどうか確認する
    int userCount = userRepository.countByEmail(userCreationOptions.email);
    if (userCount != 0) {
      throw new UserException("このE-mailアドレスは既に登録されています。");
    }
    userRepository.save(userCreationOptions);
  }
}
