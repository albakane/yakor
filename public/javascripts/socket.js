let socket = io();

socket.on('MQTTEvent', function(message) {

  if (message.state === 1) {
    let door = document.querySelector('.door-' + message.doorId + '.door');
    door.parentNode.classList.remove('alert-closed');
    door.parentNode.classList.add('alert-open');
    let i = 0;
    /*window.setTimeout(function() {
      if (i === 8) {
          door.parentNode.classList.remove('alert-open');
          door.parentNode.classList.add('alert-closed');
          socket.emit('close the door', message.doorId);
          window.clearTimeout(this);
      }
      i++;
    }, 1000);*/
  }

/*  if (message.state === 0) {
    let door = document.querySelector('.door-' + message.doorId + ' .door');
    door.parentNode.classList.remove('alert-open');
    door.parentNode.classList.add('alert-closed');
    door.innerHTML = 'PORTE n°' + message.doorId + ' : closed';
  } else if (message.state === 1) {
    let door = document.querySelector('.door-' + message.doorId + ' .door');
    door.parentNode.classList.remove('alert-closed');
    door.parentNode.classList.add('alert-open');
    door.innerHTML = 'PORTE n°' + message.doorId + ' : open';
  } else {
    console.log('coucou');
    let door = document.querySelector('.door-' + message.doorId + ' .door');
    door.parentNode.classList.add('alert-noright');
  }*/
});

socket.on('MQTTEventProblem', function(message) {
  console.log(message);
  let alert = document.createElement('div');
  let body = document.querySelector('body');
  let content = document.createElement('p');
  content.innerHTML += message.content;
  alert.appendChild(content);
  body.appendChild(alert);
  alert.classList.add('news');
  alert.classList.add('news-problem');
  alert.classList.add('activated');
  console.log(alert);
});
