package sample.java.webauthn.domain.util;

import java.nio.ByteBuffer;
import java.util.UUID;
import org.apache.commons.codec.binary.Base64;

public class UuidUtil {

  public static UUID asUuid(byte[] bytes) {
    ByteBuffer bb = ByteBuffer.wrap(bytes);
    long firstLong = bb.getLong();
    long secondLong = bb.getLong();
    return new UUID(firstLong, secondLong);
  }

  public static byte[] asBytes(UUID uuid) {
    ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
    bb.putLong(uuid.getMostSignificantBits());
    bb.putLong(uuid.getLeastSignificantBits());
    return bb.array();
  }

  public static String uuidToBase64(UUID uuid) {
    Base64 base64 = new Base64();
    ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
    bb.putLong(uuid.getMostSignificantBits());
    bb.putLong(uuid.getLeastSignificantBits());
    return base64.encodeBase64URLSafeString(bb.array());
  }

  public static String uuidToBase64(String uuidStr) {
    return uuidToBase64(UUID.fromString(uuidStr));
  }

  public static String uuidFromBase64(String str) {
    Base64 base64 = new Base64();
    byte[] bytes = base64.decodeBase64(str);
    ByteBuffer bb = ByteBuffer.wrap(bytes);
    UUID uuid = new UUID(bb.getLong(), bb.getLong());
    return uuid.toString();
  }
}
