$(function(){
  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
  console.log("onLoad処理開始")
  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")



// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// FIDO認証情報リクエスト処理
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#webauthn-register-request-btn").on('click',function(){
    axios.post('/webauthn/register', {
      email: $("input#email").val()
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log(response.data.data);
      $("#webauthn-register-response-json-raw").val(JSON.stringify(response.data.data));
      var textareaVal = JSON.stringify(response.data.data, null , "\t");
      $("#webauthn-register-response").val(textareaVal);

    })
    .catch(function (error) {
      console.log(error);
      $("#webauthn-register-response").val("NG");
    })
    .finally(function () {
      console.log("finally");
    });

    return false;
  });

// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
// 認証機との処理に使用するパラメータの作成処理
// ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
  $("#cred-parameter-create-btn").on('click',function(){
    // hidden属性に保存してあったFIDO認証情報JSONを取得
    var fidoAuthResp = $("#webauthn-register-response-json-raw").val();
    fidoAuthResp = JSON.parse(fidoAuthResp);

    // ==========================================================
    //  認証機との処理に使用するパラメータの作成
    // ==========================================================
    var publicKeyCredentialCreationOptions = {
        challenge: window.atob(fidoAuthResp.challenge) + " ★TODO バイナリ変換",
        rp: fidoAuthResp.rp,
        user: {
            id: window.atob(fidoAuthResp.user.id) + " ★TODO バイナリ変換",
            name: fidoAuthResp.user.name,
            displayName: fidoAuthResp.user.displayName,
        },
        attestation: fidoAuthResp.attestation,
        pubKeyCredParams: [{
            type: 'public-key',
            alg: -7,
        }],
        authenticatorSelection: {
            authenticatorAttachment: 'cross-platform',
            requireResidentKey: false,
            userVerification: 'discouraged'
        }
    };

    $("#cred-parameter-create-result-json-raw").val(JSON.stringify(publicKeyCredentialCreationOptions));
    var textareaVal = JSON.stringify(publicKeyCredentialCreationOptions, null , "\t");
    $("#cred-parameter-create-result").val(textareaVal);



    $("").val(fidoAuthResp);

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

  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
  console.log("onLoad処理完了")
  console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
});