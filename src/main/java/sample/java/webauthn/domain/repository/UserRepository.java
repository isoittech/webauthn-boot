package sample.java.webauthn.domain.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import sample.java.webauthn.domain.entity.UserCreationOptions;

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
  void save(@Param("user") UserCreationOptions user);
}
