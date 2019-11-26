window.logging = {
  info: function(msg) {
    var ul = document.getElementById('console-list');
    var li = document.createElement('li');
    li.innerHTML = msg;
    li.setAttribute('class','info');
    ul.appendChild(li);
  },
  error: function(msg) {
    var ul = document.getElementById('console-list');
    var li = document.createElement('li');
    li.innerHTML = msg;
    li.setAttribute('class','error');
    ul.appendChild(li);
  }
}
