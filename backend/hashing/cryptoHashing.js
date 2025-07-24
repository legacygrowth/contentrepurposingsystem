const CryptoJS = require("crypto-js");

const secretKey = "my-secret-key"; 

// Encrypt Function
const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Decrypt Function
const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
