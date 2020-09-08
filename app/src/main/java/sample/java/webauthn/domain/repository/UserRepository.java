package sample.java.webauthn.domain.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import sample.java.webauthn.domain.dto.UserEntity;

@Mapper
public interface UserRepository {

  @Select("SELECT COUNT(*) FROM m_user WHERE email = #{email}")
  int countByEmail(String email);

  @Insert(
      "INSERT INTO "
          + "m_user("
          + "  user_id"
          + "  , name"
          + "  , display_name"
          + "  , email"
          + "  , challenge"
          + "  , rp_name"
          + "  , attestation"
          + ") "
          + "VALUES("
          + "  #{user.fidoUser.id}"
          + "  , #{user.fidoUser.name}"
          + "  , #{user.fidoUser.displayName}"
          + "  , #{user.email}"
          + "  , #{user.challenge}"
          + "  , #{user.rp.name}"
          + "  , #{user.attestation}"
          + ")")
  @Options(useGeneratedKeys = true, keyProperty = "id")
  void save(@Param("user") UserEntity user);

  @Select("SELECT * FROM m_user WHERE email = #{email}")
  @Results(
      id = "allUserEntity",
      value = {
        @Result(column = "user_id", property = "fidoUser.id"),
        @Result(column = "name", property = "fidoUser.name"),
        @Result(column = "display_name", property = "fidoUser.displayName"),
        @Result(column = "email", property = "email"),
        @Result(column = "challenge", property = "challenge"),
        @Result(column = "rp_name", property = "rp.name"),
        @Result(column = "attestation", property = "attestation")
      })
  UserEntity findByEmail(String email);

  @Update(
      "UPDATE "
          + "m_user "
          + "SET"
          + " authenticator = #{authenticatorBase64}"
          + "WHERE"
          + " email = #{email}")
  int saveAuthenticator(String email, String authenticatorBase64);

  @Update(
      "UPDATE "
          + "m_user "
          + "SET"
          + " challenge = #{challengeBase64}"
          + "WHERE"
          + " email = #{email}")
  int saveChallenge(String email, String challengeBase64);
}
