var server_url="https://rifas.pythonanywhere.com/"

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

    function logout(){
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    }

    document.getElementById("logoutBtn").addEventListener("click", logout);




    //check if access_token cookie is set -->
        if (!getCookie("access_token")){
            //if not, redirecting to index page
            window.location.href = "index.html";
        }

        //clear all text fields
        document.getElementById("message-form").reset();

    function deleteMsg(){
        //ask for confirmation
        let confirm = window.confirm("Are you sure you want to delete this message?");
        if (!confirm)
            return;

        let msg_id = this.getAttribute("data-id");
        let user_id = getCookie("user_id");
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", server_url+"/chats/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        let data = {
            "user_id": parseInt(user_id),
            "id": msg_id
        }
        xhr.setRequestHeader("Authorization", getCookie("access_token"));

        xhr.onreadystatechange = function(){
            if(xhr.readyState == XMLHttpRequest.DONE){
                let response = JSON.parse(xhr.responseText);
                if(xhr.status == 200){
                    alert("Success! Message deleted.");
                    //reload the page
                    window.location.reload();
                }
                else{
                    alert("Error: "+response.message);
                }
            }
        }

        xhr.send(JSON.stringify(data));
    }

        //load all messages
        function loadMessages(){
            let xhr = new XMLHttpRequest();
            xhr.open("GET", server_url+"/chats/", true);

            let data={
                "limit": 50
            }
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader("Authorization", getCookie("access_token"));

            let user_id = parseInt(getCookie("user_id"));

            xhr.onreadystatechange = function() {
                if(xhr.readyState == XMLHttpRequest.DONE){
                    if (xhr.status == 200){
                        let response = JSON.parse(xhr.responseText);
                        let messages = response.messages;
                        //fetch template 0
                        let template = document.getElementsByTagName("template")[0];
                        //let outputHTML = "";
                        for (let i=0; i<messages.length; i++){
                            //fetch HTML template 0
                            let node = template.content.cloneNode(true);
                            node.getElementById("msg-title").innerHTML = messages[i].title;
                            node.getElementById("msg-username").innerHTML = messages[i].username;
                            node.getElementById("msg-content").innerHTML = messages[i].message;
                            node.getElementById("msg-date").innerHTML = messages[i].date;
                            if(messages[i].user_id == user_id){
                                node.getElementById("delBtn").style.display = "block";
                                node.getElementById("delBtn").setAttribute("data-id", messages[i].id);
                                //add event listener to delete button
                                node.getElementById("delBtn").addEventListener("click", deleteMsg);
                            }
                            document.body.appendChild(node);
                        }


                    }
                    else{
                        alert("Error: "+response.message);
                    }
                }
            }

            xhr.send(JSON.stringify(data));
        }

        loadMessages();




    //function to handle post message operation
    document.getElementById("message-form").addEventListener("submit", function(event){
        event.preventDefault();
        let title = document.getElementById("message-form-title").value;
        let message = document.getElementById("message-form-content").value;
        let data = {
            "title": title,
            "message": message,
            "user_id": getCookie("user_id")
        };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", server_url+"/chats/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("Authorization", getCookie("access_token"));

        xhr.onreadystatechange = function(){
            if(xhr.readyState == XMLHttpRequest.DONE){
                let response = JSON.parse(xhr.responseText);
                if(xhr.status == 201){
                    alert("Success! Message posted.");
                    //reload the page
                    window.location.reload();
                }
                else{
                    alert("Error: "+response.message);
                }
            }
        }

        xhr.send(JSON.stringify(data));
    });

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
                    document.cookie = "access_token= JWT " + response.access_token + "; expires=" + date.toUTCString()+ "; path=/";
                    //advancing to /../message_board.html page
                    window.location.href = "message_board.html";
                }else{
                    alert("authentication failed");
                }
            }
        }

        xhr.send(JSON.stringify(data));
    } );





}


