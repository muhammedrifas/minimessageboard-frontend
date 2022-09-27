var server_url="https://rifas.pythonanywhere.com"

window.onload = function (){

//function to fetch cookie of given name
    function getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return undefined;
    }

    if (getCookie("access_token")){
        let xhr = new XMLHttpRequest();
        xhr.open("POST", server_url+"/token_validation", true);
        xhr.setRequestHeader("Authorization", getCookie("access_token"));
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE){
                if (xhr.status == 200){
                    window.location.href = "message.html";
                }
            }
        }
    }



    //function to handle sign up operation
    document.getElementById("signup-form").addEventListener("submit", function(event){
        event.preventDefault();
        let username = document.getElementById("signup-form-username").value;
        let password = document.getElementById("signup-form-password").value;
        let data = {
            "username": username,
            "password": password,
        };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", server_url+"/signup/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function(){
            if(xhr.readyState == XMLHttpRequest.DONE){
                let response = JSON.parse(xhr.responseText);
                if(xhr.status == 201){
                    alert("Success! Now login to continue.");
                    //reload the page
                    window.location.reload();
                }
                else{
                    alert("Error: "+response.message);
                }
            }
        }

        xhr.send(JSON.stringify(data));
    } );

    //function to handle login operation
    document.getElementById("login-form").addEventListener("submit", function(event){
        event.preventDefault();
        let username = document.getElementById("login-form-username").value;
        let password = document.getElementById("login-form-password").value;
        let data = {
            "username": username,
            "password": password,
        };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", server_url+"/login/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function(){
            if(xhr.readyState == XMLHttpRequest.DONE){
                let response = JSON.parse(xhr.responseText);
                if (response.access_token) {
                    //store response.access_token in a cookie with expiry date of 10 days
                    var date = new Date();
                    date.setDate(date.getDate() + 10);
                    document.cookie = "access_token= Bearer " + response.access_token + "; expires=" + date.toUTCString()+ "; path=/";
                    //store response.user_id in a cookie with expiry date of 10 days
                    document.cookie = "user_id=" + response.user_id + "; expires=" + date.toUTCString()+ "; path=/";
                    //advancing to /../message.html page
                    window.location.href = "message.html";
                }else{
                    alert("authentication failed");
                }
            }
        }

        xhr.send(JSON.stringify(data));
    } );

}


