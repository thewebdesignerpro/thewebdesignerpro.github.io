<!--

function submitForm1() {
if (isFirstname(0) && isEmail(0) && isMessage(0) && isSagotin(0)) {
alert ("\n You message has been submitted. \n\nThank You!");
return true;
}
else {
return false;
}
}

function isFirstname(nnn) {
if (document.forms[nnn].elements[2].value == "") {
alert ("\n The Name field is required.")
document.forms[nnn].elements[2].focus();
return false;
}
return true;
}

function isMessage(nnn) {
if (document.forms[nnn].elements[4].value == "") {
alert ("\n The Message field is required.")
document.forms[nnn].elements[4].focus();
return false;
}
return true;
}

function isEmail(eee) {
if (document.forms[eee].elements[3].value == "") {
alert ("\n The Email field is required.")
document.forms[eee].elements[3].focus();
return false;
}
if (document.forms[eee].elements[3].value.indexOf ('@',0) == -1 ||
document.forms[eee].elements[3].value.indexOf ('.',0) == -1) {
alert ("\n The Email field requires an \"@\" and a \".\" be used. \n\nPlease re-enter your email address.")
document.forms[eee].elements[3].select();
document.forms[eee].elements[3].focus();
return false;
}
return true;
}

function isSagotin(sss) {
if (document.forms[sss].elements[5].value == "") {
alert ("\n This answer is required.")
document.forms[sss].elements[5].focus();
return false;
}
if (document.forms[sss].elements[5].value != "16") {
alert ("\n The answer is wrong.")
document.forms[sss].elements[5].focus();
return false;
}
if (document.forms[sss].elements[5].value == "16") {
return true;
}
}

//-->