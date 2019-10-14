var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  var DONE = 4;
  var OK = 200;
  if (xhr.readyState == DONE) {
    if (xhr.status == OK) {
       console.log("[xhr] Request came back with data: " + xhr.responseText);
    } else {
       console.error("[xhr] Request came back with an ERROR: " + xhr.status);
    }
  }
}

xhr.open('POST', 'http://server.company.com:5000/', false);

//// Simple Request (no preflight)
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send("action%3Dping");

//// Not-So-Simple Request (with preflight)
//xhr.setRequestHeader('Content-Type', 'application/json');
//xhr.send(JSON.stringify({"state":"ping"}));
