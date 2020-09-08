// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// グローバル変数
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ブラウザAPI（認証器に対する公開鍵の生成要求）に渡すパラメータ
var publicKeyCredentialCreationOptions_grobal;
// ブラウザAPI（認証器に対する公開鍵の生成要求）からの返却オブジェクト
var attestationObject_grobal;
// ブラウザAPI（認証器に対する公開鍵の取得要求）に渡すパラメータ
var publicKeyCredentialRequestOptions_grobal;
// ブラウザAPI（認証器に対する公開鍵の取得要求）からの返却オブジェクト
var assertionResponse_grobal;

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function base64ToBinary(base64Str){
  /*
   * BASE64をUint8Arrayに変換する
   */
  var binary = atob(base64Str);
  var len = binary.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++)        {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// バイナリ→Base64変換
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
function binaryToBase64(binaryObj){
  return window.btoa(String.fromCharCode.apply(null, new Uint8Array(binaryObj)));
}


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// onLoad処理
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
$(function(){
  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
  console.log("onLoad処理開始")
  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")



// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理（登録）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#webauthn-register-request-btn").on('click',function(){
    axios.post('/webauthn/register/parameter', {
        email: $("input#email").val()
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(function (response) {
      console.log(response.data.data);
      $("#webauthn-register-response-json-raw").val(JSON.stringify(response.data.data));
      var textareaVal = JSON.stringify(response.data.data, null , "\t");
      $("#webauthn-register-response").val(textareaVal);

    }).catch(function (error) {
      console.log(error);
      if(error.response.data.message) {
        $("#webauthn-register-response").val("【ERROR】\n" + error.response.data.message);
      } else {
        $("#webauthn-register-response").val("【ERROR】\n原因不明のエラーです");
      }
    }).finally(function () {
      console.log("finally");
    });

    return false;
  });

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理（認証）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#webauthn-login-request-btn").on('click',function(){
    axios.post('/webauthn/login/parameter', {
        email: $("input#email").val()
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(function (response) {
      console.log(response.data.data);
      $("#webauthn-login-response-json-raw").val(JSON.stringify(response.data.data));
      var textareaVal = JSON.stringify(response.data.data, null , "\t");
      $("#webauthn-login-response").val(textareaVal);

    }).catch(function (error) {
      console.log(error);
      if(error.response.data.message) {
        $("#webauthn-login-response").val("【ERROR】\n" + error.response.data.message);
      } else {
        $("#webauthn-login-response").val("【ERROR】\n原因不明のエラーです");
      }
    }).finally(function () {
      console.log("finally");
    });

    return false;
  });


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証機との処理に使用するパラメータの作成処理（登録編）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#cred-parameter-create-btn").on('click',function(){
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
    publicKeyCredentialCreationOptions_grobal = publicKeyCredentialCreationOptions;
    var textareaVal = JSON.stringify(publicKeyCredentialCreationOptions, null , "\t");
    $("#cred-parameter-create-result").val(textareaVal);

    return false;
  });



// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証機との処理に使用するパラメータの作成処理（認証編）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#login-cred-parameter-create-btn").on('click',function(){
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
    };

    publicKeyCredentialRequestOptions_grobal = publicKeyCredentialRequestOptions;
    var textareaVal = JSON.stringify(publicKeyCredentialRequestOptions, null , "\t");
    $("#login-cred-parameter-create-result").val(textareaVal);

    return false;
  });


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// navigator.credentials.create()呼び出し
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#cred-api-call-btn").on('click',function(){
    // ==========================================================
    //  ブラウザAPIを実行（認証器に対して公開鍵の生成要求）
    // ==========================================================
    navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions_grobal
    }).then((result) => {
      attestationObject_grobal = result;
      console.log(attestationObject_grobal);

      // ---------------------------------
      // Textareaフォームに表示したいためだけの処理
      // ---------------------------------
      var attestationObject = {
        PublicKeyCredential: {
          id: attestationObject_grobal.id,
          rawId: binaryToBase64(attestationObject_grobal.rawId)+ " ★実際はバイナリ",
          response: {
            attestationObject: binaryToBase64(attestationObject_grobal.response.attestationObject)+ " ★実際はバイナリ",
            clientDataJSON: binaryToBase64(attestationObject_grobal.response.clientDataJSON)+ " ★実際はバイナリ",
          },
          type: attestationObject_grobal.type
        }
      };

      var textareaVal = JSON.stringify(attestationObject, null , "\t");
      $("#cred-api-call-result").val(textareaVal);
    }).catch((errorObj) => {
      console.log(errorObj);
      var textareaVal = JSON.stringify(errorObj.message, null , "\t");
      $("#cred-api-call-result").val("【ERROR】\n" + textareaVal);
    });

    return false;
  });


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// navigator.credentials.get()呼び出し
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#login-cred-api-call-btn").on('click',function(){
    // ==========================================================
    //  ブラウザAPIを実行（認証器に対して公開鍵の取得要求）
    // ==========================================================
    navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions_grobal
    }).then((result) => {
      assertionResponse_grobal = result;
      console.log(assertionResponse_grobal);

      // ---------------------------------
      // Textareaフォームに表示したいためだけの処理
      // ---------------------------------
      var assertionResponse = "あとまわし";
//      var assertionResponse = {
//        PublicKeyCredential: {
//          id: assertionResponse_grobal.id,
//          rawId: binaryToBase64(assertionResponse_grobal.rawId)+ " ★実際はバイナリ",
//          response: {
//            assertionResponse: binaryToBase64(assertionResponse_grobal.response.assertionResponse)+ " ★実際はバイナリ",
//            clientDataJSON: binaryToBase64(assertionResponse_grobal.response.clientDataJSON)+ " ★実際はバイナリ",
//          },
//          type: assertionResponse_grobal.type
//        }
//      };

      var textareaVal = JSON.stringify(assertionResponse, null , "\t");
      $("#login-cred-api-call-result").val(textareaVal);
    }).catch((errorObj) => {
      console.log(errorObj);
      var textareaVal = JSON.stringify(errorObj.message, null , "\t");
      $("#login-cred-api-call-result").val("【ERROR】\n" + textareaVal);
    });

    return false;
  });

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証情報（公開鍵）登録を要求（ブラウザから認証サーバへ）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#public-credential-register-request-btn").on('click',function(){
    // ==========================================================
    //  認証サーバへ送信するパラメータを作成する
    // ==========================================================
    var attestationObject = {
      id: attestationObject_grobal.id,
      rawId: binaryToBase64(attestationObject_grobal.rawId),
      response: {
        attestationObject: binaryToBase64(attestationObject_grobal.response.attestationObject),
        clientDataJSON: binaryToBase64(attestationObject_grobal.response.clientDataJSON),
      },
      type: attestationObject_grobal.type,
      email: $("input#email").val()
    };

    // ==========================================================
    //  認証サーバへ送信する
    // ==========================================================
    axios.post('/webauthn/credential', attestationObject, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    }).then(function (response) {
      console.log(response.data.data);
      var textareaVal = JSON.stringify(response.data.data, null , "\t");
      $("#public-credential-register-request-result").val(textareaVal);
    }).catch(function (error) {
      console.log(error);
      if(error.response.data.message) {
        $("#public-credential-register-request-result").val("【ERROR】\n" + error.response.data.message);
      } else {
        $("#public-credential-register-request-result").val("【ERROR】\n原因不明のエラーです");
      }
    }).finally(function () {
      console.log("finally");
    });


    return false;
  });

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// ユーザ認証を要求（ブラウザから認証サーバへ）
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#public-credential-login-request-btn").on('click',function(){
    // ==========================================================
    //  認証サーバへ送信するパラメータを作成する
    // ==========================================================
    var attestationObject = {
      rawId: binaryToBase64(assertionResponse_grobal.id),
      response: {
        authenticatorData: binaryToBase64(assertionResponse_grobal.response.authenticatorData),
        signature: binaryToBase64(assertionResponse_grobal.response.signature),
        clientDataJSON: binaryToBase64(assertionResponse_grobal.response.clientDataJSON),
      },
      id: assertionResponse_grobal.id,
      type: assertionResponse_grobal.type,
      email: $("input#email").val()
     };

    // ==========================================================
    //  認証サーバへ送信する
    // ==========================================================
    axios.post('/webauthn/login', attestationObject, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    }).then(function (response) {
      console.log(response.data.data);
      var textareaVal = JSON.stringify(response.data.data, null , "\t");
      $("#public-credential-login-request-result").val(textareaVal);
    }).catch(function (error) {
      console.log(error);
      if(error.response.data.message) {
        $("#public-credential-login-request-result").val("【ERROR】\n" + error.response.data.message);
      } else {
        $("#public-credential-login-request-result").val("【ERROR】\n原因不明のエラーです");
      }
    }).finally(function () {
      console.log("finally");
    });


    return false;
  });


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// テキストエリア自動拡張機能
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("textarea.auto-resize").height(30);//init
  $("textarea.auto-resize").css("lineHeight","20px");//init

  $("textarea.auto-resize").on("change keyup keydown paste cut input blur focus",function(evt){
    if(evt.target.scrollHeight > evt.target.offsetHeight){
        $(evt.target).height(evt.target.scrollHeight);
    }else{
      var lineHeight = Number($(evt.target).css("lineHeight").split("px")[0]);
      while (true){
        $(evt.target).height($(evt.target).height() - lineHeight);
        if(evt.target.scrollHeight > evt.target.offsetHeight){
          $(evt.target).height(evt.target.scrollHeight);
          break;
        }
      }
    }
  });


// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 画面上部へ遷移する機能
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $('.rightBottomFixed').click(function(){
      $('html,body').animate({'scrollTop':0},500);
  });


  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
  console.log("onLoad処理完了")
  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
});