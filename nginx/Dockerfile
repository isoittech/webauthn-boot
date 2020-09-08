FROM nginx:latest

ENV LETSENCRYPT_HOSTS webauthn-boot.0g0.jp
ENV LETSENCRYPT_MAIL webauthn-boot@gmail.com
ENV LETSENCRYPT_SUBJECT "/C=JP/ST=Tokyo/L=Shinagawa/CN=default"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
      openssl \
      certbot \
      vim \
      less \
      curl \
    && rm -rf /var/lib/apt/lists/*

COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD /start.sh
