const fs = require('fs');
const CryptoJS = require('crypto-js');

const encryptFile = (inputFilePath, outputFilePath, key) => {
    // Read the file data as a binary buffer
    const fileData = fs.readFileSync(inputFilePath);

    // Create a WordArray from the file data
    const wordArray = CryptoJS.lib.WordArray.create(fileData);

    // Parse the key to ensure it is in the right format
    const parsedKey = CryptoJS.enc.Utf8.parse(key);

    // Encrypt the file data
    const encrypted = CryptoJS.AES.encrypt(wordArray, parsedKey, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();

    // Write the encrypted data to a file
    fs.writeFileSync(outputFilePath, encrypted);
    console.log('Fișier criptat cu succes');
};

// Your secret key
const key = 'YOUR_SECRET_KEY'; // Replace with your actual secret key
encryptFile('../../pdfs/Virginia-Woolf_Valurile.pdf', '../encrypted-files/encrypted_pdf.enc', key);
