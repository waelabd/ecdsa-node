const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("./crypto")
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  // privateKey : cbaa41ee3c93577379046d5036b7ad5bc399115542f77825b40c45e96d7e0a9e
  "04009680aa4aef2f9d083d39eeb0bbfa715fd8ec155fcdede9c527fb40dd67af1f8e95de6433259bad2134388d8b2d63622a38f64c67688c38e16fb159067d2f48": 100,
  // privateKey : ec49fc6599d3e919cbd7adeeeb4f2c778822de8a6807d680517b1d68165f3b49
  "04df522ab5740ef4de73658c7fa6cf52ee0e71f4b51a83338ec0bb35d2d2e6de985717291cb33c5dc5ee1973804365aaee97ae0d9c825877677f7a0b11e15b9fdb": 50,
  // privateKey : 98dfd09ba48730459125c030c7a849b66b1f260a49384d39bd427fa27f883c1a
  "04e56601c33671db6a8b366cc4c76f3c46ebb0421bc47ebdb90ef5efe7ad06193fbd8c26ffa6f6a24706b2962e0d825879638be23f2ddfe136da33456f504cf3f0": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature

  const { signature, message } = req.body;
  const {recipient, amount} = message

  const sender = crypto.recoverPublicKey(message, signature)

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
