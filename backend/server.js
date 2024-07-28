const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Initialize Web3 instance with the HttpProvider for Ganache
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Verify the connection to Ganache
web3.eth.net.isListening()
    .then(() => console.log('Successfully connected to Ganache'))
    .catch(e => console.log('Failed to connect to Ganache', e));

// Import the contract ABI and set the contract address
const contractABI = require('./ImprintABI.json');
const contractAddress = '0x3C991d1369e59a08D49d0CB6B975B015D9f06c60';
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(bodyParser.json());
app.use(cors());

app.post('/get-key', async (req, res) => {
    const { userAddress, tokenId } = req.body;

    try {
        console.log(`Querying balance for userAddress: ${userAddress}, tokenId: ${tokenId}`);
        const balance = await contract.methods.balanceOf(userAddress, tokenId).call().then(console.log);
        console.log(`Balance retrieved: ${balance}`);
        if (balance > 0) {
            const key = await contract.methods.getEncryptionKey(tokenId, userAddress).call().then(console.log);
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
