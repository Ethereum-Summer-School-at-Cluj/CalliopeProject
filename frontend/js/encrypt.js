const fs = require('fs');
const CryptoJS = require('crypto-js');

const encryptFile = (inputFilePath, outputFilePath, key) => {
    const fileData = fs.readFileSync(inputFilePath);
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
    fs.writeFileSync(outputFilePath, encrypted);
    console.log('Fișier criptat cu succes');
};

const key = 'YOUR_SECRET_KEY'; // Trebuie să fie aceeași cu cheia setată în contract
encryptFile('../../pdfs/Virginia-Woolf_Valurile.pdf', '../encrypted-files/encrypted_pdf.enc', key);