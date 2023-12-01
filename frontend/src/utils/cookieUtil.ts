function setTokenInCookie(token: string, expirationDays: number) {
  let d = new Date();
  d.setTime(d.getTime() + (expirationDays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = `token=${token};${expires};path=/`;
}

function getTokenFromCookie() {
  let name = "token=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  let token = "";
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) token = c.substring(name.length, c.length);
  }
  return token;
}

export {
  setTokenInCookie,
  getTokenFromCookie
}