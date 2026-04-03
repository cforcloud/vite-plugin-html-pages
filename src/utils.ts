/// utils

const postfixRE = /[?#].*$/;
const trailingSlashRE = /(.)\/$/;

/** remove search, hash and trailing slash  */
export function cleanUrl(url: string) {
  return url.replace(postfixRE, "").replace(trailingSlashRE, "$1");
}
