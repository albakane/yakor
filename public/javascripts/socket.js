let socket = io();

socket.on('MQTTEvent', function(message) {
  if (message.state === 0) {
    let door = document.querySelector('.door-' + message.doorId + ' .door');
    door.parentNode.classList.remove('alert-open');
    door.parentNode.classList.add('alert-closed');
    door.innerHTML = 'PORTE n°' + message.doorId + ' : closed';
  } else {
    let door = document.querySelector('.door-' + message.doorId + ' .door');
    door.parentNode.classList.remove('alert-closed');
    door.parentNode.classList.add('alert-open');
    door.innerHTML = 'PORTE n°' + message.doorId + ' : open';
  }
});