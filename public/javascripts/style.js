let inputs = document.querySelectorAll('.input-group .form-index-input')
let creationDates = document.querySelectorAll('.creation-date')

for (let i = 0; i < inputs.length; i++) {

  let placeholderContent = inputs[i].getAttribute('placeholder')

  inputs[i].addEventListener('mouseenter', function () {
    inputs[i].parentNode.classList.add('hover')
  })

  inputs[i].addEventListener('mouseout', function () {
    inputs[i].parentNode.classList.remove('hover')
  })

  inputs[i].addEventListener('focus', function () {
    inputs[i].parentNode.classList.add('focus')
    inputs[i].setAttribute('placeholder', '')
  })

  inputs[i].addEventListener('blur', function () {
    inputs[i].parentNode.classList.remove('focus')
    inputs[i].setAttribute('placeholder', placeholderContent)
  })

}

for (let i = 0; i < creationDates.length; i++) {

  let content = creationDates[i].innerHTML.slice(0, 15)
  creationDates[i].innerHTML = content

}
