var password = document.getElementById("password") ,
  	confirm_password = document.getElementById("confirma_p");

function validatePassword(){
  if(password.value != confirma_p.value) {
    confirm_password.setCustomValidity("NO coincide");
  } else {
    confirm_password.setCustomValidity('');
  }
}

/*
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
*/