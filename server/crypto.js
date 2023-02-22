const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {hexToBytes, toHex} = require("ethereum-cryptography/utils")

const hashMessage = (message)=> keccak256(Uint8Array.from(message))

const recoverPublicKey = (message, signature)=> {
    const hash = hashMessage(message)
    const arraySignature = hexToBytes(signature)
    const recoveryBit = arraySignature[0]
    const fullSignature = arraySignature.slice(1)
    return toHex(secp.recoverPublicKey(hash,fullSignature, recoveryBit))
}

module.exports = {hashMessage, recoverPublicKey}