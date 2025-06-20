function login(){

    let user = {
        user: document.getElementById('username').value,
        pass: document.getElementById('password').value
    };

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let res = JSON.parse(this.responseText);
            if (res.result === "failure") {
                document.getElementById("login-err").style.display='block';
            }
            if (res.user_type === "owner") {
                window.location.href = "owner-dashboard.html";
            } else if (res.user_type === "walker") {
                window.location.href = "walker-dashboard.html";
            }
        }
    };

    // Open connection to server & send the post data using a POST request
    // We will cover POST requests in more detail in week 8
    xmlhttp.open("POST", "/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(user));

}

function logout(){

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState===4 && this.status === 200) {
            window.location.href="/";
        }
    };
    // Open connection to server & send the post data using a POST request
    xmlhttp.open("POST", "/logout", true);
    xmlhttp.send();

}
