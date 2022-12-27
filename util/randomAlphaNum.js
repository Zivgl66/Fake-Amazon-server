/*
    this function will generate string with the selected size
    each char will be 0-9a-z
*/
const generateRandomAlphaNumString = (strSize) => {
  return [...Array(strSize)]
    .map(() => Math.floor(Math.random() * 35).toString(35))
    .join("");
};

module.exports = generateRandomAlphaNumString;
