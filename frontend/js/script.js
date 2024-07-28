async function getDecryptionKey(address, tokenId) {
    const response = await fetch('http://localhost:3000/get-key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userAddress: address, tokenId: tokenId })
    });

    if (response.ok) {
        const data = await response.json();
        return data.key;
    } else {
        throw new Error('Nu aveți acces la acest fișier');
    }
}

async function decryptFile(encryptedFile, key) {
    const response = await fetch(encryptedFile);
    const encryptedData = await response.arrayBuffer();
    const keyBytes = CryptoJS.enc.Base64.parse(key);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.lib.WordArray.create(encryptedData) }, keyBytes, {
        mode: CryptoJS.mode.EAX,
        padding: CryptoJS.pad.NoPadding
    });
    return decrypted.toString(CryptoJS.enc.Latin1);
}

document.getElementById('decrypt-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const tokenId = document.getElementById('tokenId').value;

    try {
        const key = await getDecryptionKey(address, tokenId);
        console.log('Cheia de decriptare:', key);

        const decryptedContent = await decryptFile('frontend/encrypted-files/encrypted.pdf.enc', key);
        console.log('Fișier decriptat:', decryptedContent);

        // Afișează PDF-ul decriptat
        const blob = new Blob([decryptedContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.innerHTML = `<iframe src="${url}" width="600" height="400"></iframe>`;
    } catch (error) {
        console.error(error.message);
    }
});