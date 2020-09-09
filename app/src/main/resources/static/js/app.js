// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// グローバル変数
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
var apiResponseHolder = {
  // ブラウザAPI（認証器に対する公開鍵の生成要求）に渡すパラメータ
  publicKeyCredentialCreationOptions: '',
  // ブラウザAPI（認証器に対する公開鍵の生成要求）からの返却オブジェクト
  attestationObject: '',
  // ブラウザAPI（認証器に対する公開鍵の取得要求）に渡すパラメータ
  publicKeyCredentialRequestOptions: '',
  // ブラウザAPI（認証器に対する公開鍵の取得要求）からの返却オブジェクト
  assertionResponse: '',
};

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function base64ToBinary(base64Str) {
  /*
   * BASE64をUint8Arrayに変換する
   */
  var binary = atob(base64Str);
  var len = binary.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// バイナリ→Base64変換
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function binaryToBase64(binaryObj) {
  return window.btoa(String.fromCharCode.apply(null, new Uint8Array(binaryObj)));
}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// APIレスポンスハンドラ
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function onApiResponseReceived(response, responsePreservedAt, responseDisplayedAt) {
  console.log(response.data.data);

  if (responsePreservedAt) {
    $(responsePreservedAt).val(JSON.stringify(response.data.data));
  }

  var textareaVal = JSON.stringify(response.data.data, null, "\t");
  $(responseDisplayedAt).val(textareaVal);

}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// APIレスポンスエラーハンドラ
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function onApiErrorResponseReceived(error, errorDisplayedAt) {
  console.log(error);
  if (error.response.data.message) {
    $(errorDisplayedAt).val("【ERROR】\n" + error.response.data.message);
  } else {
    $(errorDisplayedAt).val("【ERROR】\n原因不明のエラーです");
  }
}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ブラウザAPIレスポンスハンドラ
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function onBrowserApiResponseReceived(result, keyOfresponsePreserved, displayedObject, responseDisplayedAt) {
  apiResponseHolder[keyOfresponsePreserved] = result;
  console.log(apiResponseHolder[keyOfresponsePreserved]);

  var textareaVal = JSON.stringify(apiResponseHolder[keyOfresponsePreserved], null, "\t");;
  if (displayedObject) {
    textareaVal = JSON.stringify(displayedObject, null, "\t");;
  }
  $(responseDisplayedAt).val(textareaVal);
}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ブラウザAPIレスポンスエラーハンドラ
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function onBrowserApiErrorReceived(errorObj, errorDisplayedAt) {
  console.log(errorObj);
  var textareaVal = JSON.stringify(errorObj.message, null, "\t");
  $(errorDisplayedAt).val("【ERROR】\n" + textareaVal);
}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理（登録）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function requestWebauthnRegisterParam() {
  try {
    var response = await axios.post('/webauthn/register/parameter', {
      email: $("input#email").val()
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    onApiResponseReceived(response, "#webauthn-register-response-json-raw", "#webauthn-register-response");

  } catch (error) {
    onApiErrorResponseReceived(error, "#webauthn-register-response");

  }

  return false;

}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理（認証）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function requestWebauthnLoginParam() {
  try {
    var response = await axios.post('/webauthn/login/parameter', {
      email: $("input#email").val()
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    onApiResponseReceived(response, "#webauthn-login-response-json-raw", "#webauthn-login-response");

  } catch (error) {
    onApiErrorResponseReceived(error, "#webauthn-login-response")

  }

  return false;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証機との処理に使用するパラメータの作成処理（登録編）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function createParameterOfBrowserApiForRegister() {
  // hidden属性に保存してあったFIDO認証情報JSONを取得
  var fidoAuthResp = $("#webauthn-register-response-json-raw").val();
  fidoAuthResp = JSON.parse(fidoAuthResp);

  // ==========================================================
  //  認証機との処理に使用するパラメータの作成
  // ==========================================================
  var publicKeyCredentialCreationOptions = {
    challenge: base64ToBinary(fidoAuthResp.challenge),
    rp: {
      name: fidoAuthResp.rp.name,
      id: fidoAuthResp.rp.id
    },
    user: {
      id: base64ToBinary(fidoAuthResp.user.id),
      name: fidoAuthResp.user.name,
      displayName: fidoAuthResp.user.displayName,
    },
    attestation: fidoAuthResp.attestation,
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },
      { type: 'public-key', alg: -35 },
      { type: 'public-key', alg: -36 },
      { type: 'public-key', alg: -257 }, //Windows Hello supports the RS256 algorithm
      { type: 'public-key', alg: -258 },
      { type: 'public-key', alg: -259 },
      { type: 'public-key', alg: -37 },
      { type: 'public-key', alg: -38 },
      { type: 'public-key', alg: -39 },
      { type: 'public-key', alg: -8 }
    ],
    authenticatorSelection: {
      // platform: 認証機器がクライアントに接続されており、通常は取り外し不可能である
      // cross-platform: 機器が異なるプラットフォームをまたがって使用される可能性があることを示す (USB や NFC 端末など)。
      authenticatorAttachment: 'platform',
      //          authenticatorAttachment: 'cross-platform',
      requireResidentKey: true, // 認証機にユーザ情報を保存するか否か
      userVerification: 'required' // required=ユーザ認証を行わせる
    }
  };

  // $("#cred-parameter-create-result-json-raw").val(JSON.stringify(publicKeyCredentialCreationOptions));
  // 上記では、hiddenパラメータにブラウザAPIパラメータをJSON文字列にして保存している。
  // それを、ブラウザAPIに渡す直前に、JSON文字列からオブジェクトに戻しても、
  // そのオブジェクトをブラウザAPIに渡すとエラーを返されてしまう。
  // TypeError: Failed to execute 'create' on
  //   'CredentialsContainer': The provided value is not of
  //   type '(ArrayBuffer or ArrayBufferView)'
  // そのため、グローバルな領域に変数を定義し、そこへ保存することとする。
  apiResponseHolder.publicKeyCredentialCreationOptions = publicKeyCredentialCreationOptions;
  var textareaVal = JSON.stringify(publicKeyCredentialCreationOptions, null, "\t");
  $("#cred-parameter-create-result").val(textareaVal);

  return false;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証機との処理に使用するパラメータの作成処理（認証編）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function createParameterOfBrowserApiForLogin() {
  // hidden属性に保存してあったFIDO認証情報JSONを取得
  var fidoAuthResp = $("#webauthn-login-response-json-raw").val();
  fidoAuthResp = JSON.parse(fidoAuthResp);

  // ==========================================================
  //  認証機との処理に使用するパラメータの作成
  // ==========================================================
  var publicKeyCredentialRequestOptions = {
    challenge: base64ToBinary(fidoAuthResp.challenge),
    allowCredentials: [{
      id: base64ToBinary(fidoAuthResp.allowCredentials[0].id),
      type: fidoAuthResp.allowCredentials[0].type,
      transports: fidoAuthResp.allowCredentials[0].transports
    }],
    userVerification: 'required', // required=ユーザ認証を行わせる
    timeout: 60000,
  };

  apiResponseHolder.publicKeyCredentialRequestOptions = publicKeyCredentialRequestOptions;
  var textareaVal = JSON.stringify(publicKeyCredentialRequestOptions, null, "\t");
  $("#login-cred-parameter-create-result").val(textareaVal);

  return false;
}



// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// navigator.credentials.create()呼び出し
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function executeBrowserApiOfRegister() {
  try {
    // ==========================================================
    //  ブラウザAPIを実行（認証器に対して公開鍵の生成要求）
    // ==========================================================
    var result = await navigator.credentials.create({
      publicKey: apiResponseHolder.publicKeyCredentialCreationOptions
    });

    // ---------------------------------
    // Textareaフォームに表示したいためだけの処理
    // ---------------------------------
    var displayAttestationObject = {
      PublicKeyCredential: {
        id: result.id,
        rawId: binaryToBase64(result.rawId) + " ★実際はバイナリ",
        response: {
          attestationObject: binaryToBase64(result.response.attestationObject) + " ★実際はバイナリ",
          clientDataJSON: binaryToBase64(result.response.clientDataJSON) + " ★実際はバイナリ",
        },
        type: result.type
      }
    };

    onBrowserApiResponseReceived(result, 'attestationObject', displayAttestationObject, "#cred-api-call-result");
  } catch (error) {
    onBrowserApiErrorReceived(error, "#cred-api-call-result")
  }

  return false;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// navigator.credentials.get()呼び出し
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function executeBrowserApiOfLogin() {
  try {
    // ==========================================================
    //  ブラウザAPIを実行（認証器に対して公開鍵の取得要求）
    // ==========================================================
    var result = await navigator.credentials.get({
      publicKey: apiResponseHolder.publicKeyCredentialRequestOptions
    });
    onBrowserApiResponseReceived(result, 'assertionResponse', null, "#login-cred-api-call-result"); // TODO nullの部分

  } catch (error) {
    onBrowserApiErrorReceived(error, "#login-cred-api-call-result")

  }

  return false;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証情報（公開鍵）登録を要求（ブラウザから認証サーバへ）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function requestWebauthnRegister() {
  // ==========================================================
  //  認証サーバへ送信するパラメータを作成する
  // ==========================================================
  var attestationObject = {
    id: apiResponseHolder.attestationObject.id,
    rawId: binaryToBase64(apiResponseHolder.attestationObject.rawId),
    response: {
      attestationObject: binaryToBase64(apiResponseHolder.attestationObject.response.attestationObject),
      clientDataJSON: binaryToBase64(apiResponseHolder.attestationObject.response.clientDataJSON),
    },
    type: apiResponseHolder.attestationObject.type,
    email: $("input#email").val()
  };


  try {
    // ==========================================================
    //  認証サーバへ送信する
    // ==========================================================
    var response = await axios.post('/webauthn/credential', attestationObject, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    });
    onApiResponseReceived(response, null, "#public-credential-register-request-result");

  } catch (error) {
    onApiErrorResponseReceived(error, "#public-credential-register-request-result");

  }

  return false;
}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ユーザ認証を要求（ブラウザから認証サーバへ）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
async function requestWebauthnLogin() {
  // ==========================================================
  //  認証サーバへ送信するパラメータを作成する
  // ==========================================================
  var attestationObject = {
    rawId: binaryToBase64(apiResponseHolder.assertionResponse.id),
    response: {
      authenticatorData: binaryToBase64(apiResponseHolder.assertionResponse.response.authenticatorData),
      signature: binaryToBase64(apiResponseHolder.assertionResponse.response.signature),
      clientDataJSON: binaryToBase64(apiResponseHolder.assertionResponse.response.clientDataJSON),
    },
    id: apiResponseHolder.assertionResponse.id,
    type: apiResponseHolder.assertionResponse.type,
    email: $("input#email").val()
  };

  try {
    // ==========================================================
    //  認証サーバへ送信する
    // ==========================================================
    var response = await axios.post('/webauthn/login', attestationObject, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    });
    onApiResponseReceived(response, null, "#public-credential-login-request-result");

  } catch (error) {
    onApiErrorResponseReceived(error, "#public-credential-login-request-result");

  }

  return false;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// onLoad処理
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
$(function () {
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // 登録ページ FIDO認証情報要求ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#webauthn-register-request-btn").on('click', function () {
    requestWebauthnRegisterParam();
    return false;
  });


  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // 登録ページ 認証機パラメータ作成ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#cred-parameter-create-btn").on('click', function () {
    createParameterOfBrowserApiForRegister();
    return false;
  });


  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // 登録ページ ブラウザAPI実行ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#cred-api-call-btn").on('click', function () {
    executeBrowserApiOfRegister();
    return false;
  });


  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // 登録ページ 認証情報登録要求ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#public-credential-register-request-btn").on('click', function () {
    requestWebauthnRegister();
    return false;
  });


  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // 登録ページ 「FIDO認証一気にやる」ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#webauthn-register-ikki-btn").on('click', async function () {
    await requestWebauthnRegisterParam();
    await createParameterOfBrowserApiForRegister();
    await executeBrowserApiOfRegister();
    await requestWebauthnRegister();
    $("html,body").animate({ scrollTop: $('#public-credential-register-request').offset().top });
    return false;
  });

  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ログインページ FIDO認証情報要求ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#webauthn-login-request-btn").on('click', function () {
    requestWebauthnLoginParam();
    return false;
  });

  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ログインページ 認証機パラメータ作成ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#login-cred-parameter-create-btn").on('click', function () {
    createParameterOfBrowserApiForLogin();
    return false;
  });

  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ログインページ ブラウザAPI実行ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#login-cred-api-call-btn").on('click', function () {
    executeBrowserApiOfLogin();
    return false;
  });

  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // ログインページ ユーザ認証要求ボタン クリックハンドラ
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#public-credential-login-request-btn").on('click', function () {
    requestWebauthnLogin();
    return false;
  });



  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // テキストエリア自動拡張機能
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("textarea.auto-resize").height(30);//init
  $("textarea.auto-resize").css("lineHeight", "20px");//init

  $("textarea.auto-resize").on("change keyup keydown paste cut input blur focus", function (evt) {
    if (evt.target.scrollHeight > evt.target.offsetHeight) {
      $(evt.target).height(evt.target.scrollHeight);
    } else {
      var lineHeight = Number($(evt.target).css("lineHeight").split("px")[0]);
      while (true) {
        $(evt.target).height($(evt.target).height() - lineHeight);
        if (evt.target.scrollHeight > evt.target.offsetHeight) {
          $(evt.target).height(evt.target.scrollHeight);
          break;
        }
      }
    }
  });


  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  // 画面上部へ遷移する機能
  // ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $('.rightBottomFixed').click(function () {
    $('html,body').animate({ 'scrollTop': 0 }, 500);
  });


});