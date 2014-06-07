(function(){

 Parse.initialize("bJTmZpTfn1Fg6iybqzDMnGpujoL48M4C6yDuQGi8",
                  "jTEQEFXUoYETKx3MCBrLrNn1dIaEFAv7x2mNTzGN ");
 // 初始化Parse() 我的account裡面的APP key Application ID &Javascript Key之後才把東西存在我的account ;

 


 var templates = {};
  ['loginView', 'evaluationView', 'updateSuccessView', 'scoreboardView'].forEach(function(e){
    var tpl = document.getElementById(e).text;
    templates[e] = doT.template(tpl);
  });
  // 編譯template engine函數();
  // 主要分成幾個部分登入畫面、成績輸入畫面、更新成功畫面、成績板畫面;


  
  var handler = {
    navbar: function(){
	  var current_user = Parse.User.current();
      if(current_user){
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('evaluationButton').style.display = 'block';
        document.getElementById('scoreboardButton').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
        //到parse確認現在的使用者是誰，navbar需顯示哪些button();
        //登入不須顯示；成績輸入、成績板和登出需顯示;
      } else {
        document.getElementById('loginButton').style.display = 'block';
        document.getElementById('evaluationButton').style.display = 'none';
        document.getElementById('scoreboardButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'none';   
        //到parse確認現在的使用者是誰，navbar需顯示哪些button();
        //只需顯示登入;      
      }
      document.getElementById('logoutButton').addEventListener('click', function(){
        Parse.User.logOut();
        handler.navbar();
        window.location.hash = 'login/';
        //這段不是很懂;
      });
    };


    login: function(){
      var current_user = Parse.User.current();
      var postAction = function(){
        handler.navbar();
        window.location.hash = 'peer-evaluation/';
        handler.evaluation();
        //到parse確認現在的使用者是誰，確認登入者後，將網址改為peer-evaluation;
      }
      if (current_user) {
        window.location.hash = 'peer-evaluation/';
      } else {
        // Signin Function binding, provided by Parse SDK.        
        document.getElementById('content').innerHTML = templates.loginView();
      	// 把版型印到瀏覽器上();


        // 註冊的表單，透過助教已經寫好的TAhelp，來確定到底是不是這堂課學生的學號; 
        document.getElementById('form-signup').addEventListener('submit', function(){
          var student_id = document.getElementById('form-signup-student-id').value;
          if(!TAHelp._isMemberOf(student_id)){
            alert('大大你是來亂入的嗎');
            window.location.hash = '';
          }

        });        

        // 註冊的表單上，密碼與確認密碼是否一致(); // 
        document.getElementById('form-signup-password1').addEventListener('keyup', function(){
          var singupForm_password = document.getElementById('form-signup-password');
          var message = (this.value !== singupForm_password.value) ? '密碼打得不一樣=皿=' : '';
          //宣告變數：填寫密碼等於確認密碼
          //宣告變數：message，當輸入值(確認密碼欄位)不等於填寫密碼，顯示的提醒訊息；
          document.getElementById('form-signup-message').style.display = 'block';     
          document.getElementById('form-signup-message').innerHTML = message;  
          if(this.value === singupForm_password.value){
             document.getElementById('form-signup-message').style.display = 'none';     
          }
          //一直顯示，直到填寫密碼欄位和確認密碼欄位一致，才不顯示此message;
        });
 
        // 登入的表單上，透過助教已經寫好的TAhelp，來確定到底是不是這堂課學生的學號; //   
        document.getElementById('form-signin').addEventListener('submit', function(){
          var student_id = document.getElementById('form-signin-student-id').value;
          if(!TAHelp._isMemberOf(student_id)){
            document.getElementById('form-signin-message').style.display = 'block';     
            document.getElementById('form-signin-message').innerHTML = '你再試呀，看你多會試';
          //一直顯示，直到學號能在TAhelp面找到，才不顯示此message;
          }
        });

        // 登入的表單上，利用parse給的語法檢查登入; 
        document.getElementById('form-signin').addEventListener('submit', function(){
          Parse.User.logIn(document.getElementById('form-signin-student-id').value,
              document.getElementById('form-signin-password').value, {
            success: function(user) {
              postAction();
            },
            error: function(user, error) {
              document.getElementById('form-signin-message').style.display = 'block';     
              document.getElementById('form-signin-message').innerHTML = "才幾歲...就忘記密碼＝＝＋";
            }
            //當parse的這個user
          }); 
        });

        // 綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
        document.getElementById('form-signup').addEventListener('submit', function(){
          var user = new Parse.User();
          user.set("username", document.getElementById('form-signup-student-id').value);
          user.set("password", document.getElementById('form-signup-password').value);
          user.set("email", document.getElementById('form-signup-email').value);
 
          user.signUp(null, {
            success: function(user) {
              postAction();
              // Hooray! Let them use the app now.
            },
            error: function(user, error) {
              // Show the error message somewhere and let the user try again.
              document.getElementById('form-signup-message').style.display = 'block';     
              document.getElementById('form-signup-message').innerHTML = error.message;
            }
          });


          // var user = new Parse.User();
          // user.set("username", document.getElementById('form-signup-student-id').value);
          // user.set("password", document.getElementById('form-signup-password').value);
          // user.set("email", document.getElementById('form-signup-email').value);

          // Parse.User.signUp(document.getElementById('form-signup-student-id').value,
          //     document.getElementById('form-signup-password').value, 
          //     document.getElementById('form-signup-email').value, {
          //   success: function(user) {
          //     postAction();
          //   },
          //   error: function(user, error) {
          //     document.getElementById('form-signup-message').style.display = 'block';
          //     document.getElementById('form-signup-message').innerHTML = error.message;
          //   }
          // }); 
        });
       
        }
    },
    evaluation: function(object){
      // t = evaluation n = current_user r = access
          var evaluation = Parse.Object.extend("Evaluation");
          var current_user = Parse.User.current();
          var access = new Parse.ACL;
          access.setPublicReadAccess(true);
          access.setPublicWriteAccess(false);
          access.setReadAccess(current_user, true);
          access.setWriteAccess(current_user, true);
          // i = tmp_evaluation
          var tmp_evaluation = new Parse.Query(evaluation);
          tmp_evaluation.equalTo("user",current_user);
          tmp_evaluation.first({
            success: function(tmp_evaluation){
            window.EVAL = tmp_evaluation;
            if(tmp_evaluation === undefined){
              var s = TAHelp.getMemberlistOf(current_user.get("username")).filter(function(e){return e.StudentId !== current_user.get("username") ? true : false}).map(function(e){
                e.scores = ["0","0","0","0"];
                return e
              })
            }else{
              var s = tmp_evaluation.toJSON().evaluations
            }
            // console.log(s);
            document.getElementById("content").innerHTML = templates.evaluationView(s);
            var action = tmp_evaluation === undefined ? "送出表單" : "修改表單";
            document.getElementById("evaluationForm-submit").value = action;
            document.getElementById("evaluationForm").addEventListener("submit",function(){
              for(var o = 0; o < s.length; o++){
                for(var u = 0; u < s[o].scores.length; u++){
                  var a = document.getElementById("stu" + s[o].StudentId + "-q" + u);
                  var f = a.options[a.selectedIndex].value;s[o].scores[u] = f
                }
              }
                if(tmp_evaluation === undefined){
                  tmp_evaluation = new evaluation;
                  tmp_evaluation.set("user",current_user);
                  tmp_evaluation.setACL(access);
                }
                  tmp_evaluation.set("evaluations",s);
                  tmp_evaluation.save(null,{success: function(){
                    document.getElementById("content").innerHTML = templates.updateSuccessView();
                  },
                  error: function(){

                  }
                })
                },
                false
                )},
            error: function(e,evaluation){}
          })
      // 基本上和上課範例購物車的函數很相似，這邊會用Parse DB
      // 問看看Parse有沒有這個使用者之前提交過的peer review物件(
      // 沒有的話: 從TAHelp生一個出來(加上scores: [‘0’, ‘0’, ‘0’, ‘0’]屬性存分數並把自己排除掉)
      // 把peer review物件裡的東西透過版型印到瀏覽器上();
      // 綁定表單送出的事件(); // 如果Parse沒有之前提交過的peer review物件，要自己new一個。或更新分數然後儲存。
    },
    scoreboard: function(){
      var Score = Parse.Object.extend("Evaluation");
      var query = new Parse.Query(Score);
      // StudentId
      // scores
      // for (var i = 1; i < TAHelp._Memberlist.length; i++) {
      //   for (var j = 0; j < TAHelp._Memberlist[i].length; j++) {
      //     query.equalTo("evaluations", TAHelp._Memberlist[i][j].StudentId);
          query.find({
            success: function(results) {
              // alert("Successfully retrieved " + results.length + " scores.");
              // Do something with the returned Parse.Object values
              var s = results[0].toJSON().evaluations
              // console.log(s);
              for (var i = 1; i < results.length; i++) { 
                var object = results[i];
                // alert(object.id + ' - ' + object.get('evaluations'));
                // console.log(object.toJSON().evaluations)
                s = s.concat(object.toJSON().evaluations);
                // console.log(s);
              }
              s.sort(function(a,b){
                if (a.StudentId > b.StudentId)
                  return 1;
                if (a.StudentId < b.StudentId)
                  return -1;
                // a must be equal to b
                // else{
                //   for(var i = 0 ; i < 4 ; i++){
                //     a.scores[i] = parseInt(a.scores[i]) + parseInt(b.scores[i]);
                //   }
                  return 0;
                // }
              });
              var uniqueNames = [];
              var n = 1;
              for (var i = 0; i < s.length; i++) {
                while(s[i+n].StudentId == s[i].StudentId){
                    for(var j = 0 ; j < 4 ; j++){
                      s[i].scores[j] = parseInt(s[i].scores[j]) + parseInt(s[i+n].scores[j]);
                    }
                      n = n + 1;
                      if(i+n==s.length)break;
                }
                  uniqueNames.push(s[i]);
                  i = i + n - 1;
                  n = 1;
                  // var index = s.indexOf(s[i+1]);
                  // s.splice(index, 1);
              };
              // $.each(s, function(i, el){
              //     if(i.StudentId !== el.StudentId) uniqueNames.push(el);
              // });
              document.getElementById("content").innerHTML = templates.scoreboardView(uniqueNames);
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
      //   };
      // };

    },
  };
  var App = Parse.Router.extend({
    routes: {
      '': 'index',
      'login/': 'login',
      'peer-evaluation/': 'evaluation',
      'scoreboard/': 'scoreboard'
    },
    index: function(){
      if(Parse.User.current()){
        window.location.hash = "peer-evaluation/"
      }else{
        window.location.hash = "login/"
      }
    },
    evaluation: handler.evaluation,
    login: handler.login,
    scoreboard: handler.scoreboard
  });

  this.Router = new App();
  Parse.history.start();
  handler.navbar();
  // 讓router活起來();
})();

