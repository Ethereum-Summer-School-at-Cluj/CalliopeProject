const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Web3 instance with the HttpProvider for Polygon
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-amoy.polygon.technology/'));

// Verify the connection to Ganache
web3.eth.net.isListening()
    .then(() => console.log('Successfully connected to Polygon'))
    .catch(e => console.log('Failed to connect to Polygon', e));

// Import the contract ABI and set the contract address
const contractABI = require('./ImprintABI.json');
//console.log(JSON.stringify(contractABI, null, 2));
const contractAddress = '0x3C991d1369e59a08D49d0CB6B975B015D9f06c60';
const contract = new web3.eth.Contract(contractABI, contractAddress);
//console.log(contract);
app.use(bodyParser.json());
app.use(cors());

app.use('/files', express.static(path.join(__dirname, '../frontend/encrypted-files')));

app.post('/get-key', async (req, res) => {
    const { userAddress, tokenId } = req.body;

    try {
        console.log(`Querying balance for userAddress: ${userAddress}, tokenId: ${tokenId}`);
        const balance = await contract.methods.balanceOf(userAddress, tokenId).call();
        console.log(`Balance retrieved: ${balance}`);
        if (balance > 0) {
            const key = await contract.methods.getEncryptionKey(tokenId, userAddress).call();
            console.log(`Key retrieved: ${key}`);
            res.status(200).send({ key: key });
        } else {
            res.status(403).send({ error: 'Nu aveți acces la acest fișier' });
        }
    } catch (error) {
        console.error('Error querying balance:', error);
        res.status(500).send({ error: 'Eroare de server' });
    }
});

app.listen(port, () => {
    console.log(`Serverul rulează la http://localhost:${port}`);
});
