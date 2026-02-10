const DANGEROUS_SCHEMES_REGEX = /^\s*(javascript|vbscript|data|file):/i;
const zeroWidthSpace = '\u200B';
const url = zeroWidthSpace + 'javascript:alert(1)';
console.log('Testing URL:', encodeURI(url));
console.log('Matches regex?', DANGEROUS_SCHEMES_REGEX.test(url));
