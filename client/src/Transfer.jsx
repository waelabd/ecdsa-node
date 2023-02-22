import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import {toHex} from "ethereum-cryptography/utils";

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hashMessage(message){
    return keccak256(Uint8Array.from(message))
  }

  async function signMessage(message){
    const hash = hashMessage(message);
    const [signature, recoveryBit] = await secp.sign(hash,privateKey, {recovered:true});
    const fullSignature = new Uint8Array([recoveryBit, ...signature]);
    return toHex(fullSignature);
  }

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      recipient,
      amount: parseInt(sendAmount),
    }
    const signature = await signMessage(message)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature,
        message
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
