#!/bin/bash

for HOST in ${LETSENCRYPT_HOSTS}
do
  if [ ! -d "/etc/letsencrypt/live/${HOST}" ]; then
    mkdir -p /etc/letsencrypt/live/${HOST}
    mkdir -p /var/lib/letsencrypt

    crt_file="/etc/letsencrypt/live/${HOST}/fullchain.pem" &&
    key_file="/etc/letsencrypt/live/${HOST}/privkey.pem" &&
    subject="${LETSENCRYPT_SUBJECT}" &&
    openssl req -new -newkey rsa:2048 -sha256 -x509 -nodes \
      -set_serial 1 \
      -days 3650 \
      -subj "$subject" \
      -out "$crt_file" \
      -keyout "$key_file" &&
    chmod 400 "$key_file"
  fi
done

nginx

for HOST in ${LETSENCRYPT_HOSTS}
do
  if [ ! -e "/etc/letsencrypt/initialize" ]; then
    rm -rf /etc/letsencrypt/live/${HOST}
    # certbot certonly: 3ヶ月で失効する SSL/TLSサーバ証明書を自動で更新します
    # -n: インタラクティブ設定をオフにします
    # --keep-until-expiring: ?
    # --agree-tos: Let's Encryptの利用規約に同意します
    # --webroot: 稼働中のサービスを落とさずにSSL証明書の発行や更新ができるようになります
    #     ※Webrootプラグインの仕組みは、コマンド実行時、所定の場所に認証用のファイルを
    #       配置した後、Let's Encryptのサーバがhttpでアクセス、きちんと指定のドメインで
    #       名前解決してアクセスできるよね！ということで認証を行う。
    #       認証用のファイルの配置等はcertbotが行ってくれる。
    # --webroot-path: 認証用ファイル配置先
    # -m: アカウントの登録や回復などに使用する電子メールアドレスを指定します
    # -d: SSL/TLSサーバ証明書の取得を申請するドメイン名を指定します
    certbot certonly -n --keep-until-expiring --agree-tos \
      --webroot --webroot-path /var/lib/letsencrypt \
      -m ${LETSENCRYPT_MAIL} -d ${HOST} 
      #--dry-run
  fi
done

touch /etc/letsencrypt/initialize
certbot renew
#certbot renew --dry-run

nginx -s reload

while true
do
    sleep 7
done
