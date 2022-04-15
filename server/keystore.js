import Crypto from "crypto";
import { HASH_ALGO } from "./cliPasswordManager.js";

const SIG_TYPE = "hex";

/**
 * Manages public key authentication
 */
class Keystore {
	#publicKey = null;

	/**
	 * Changes the public key
	 */
	setPublicKey(newKey) {
		this.#publicKey = newKey;
	}

	/**
	 * Validates an incoming signed message attempt
	 */
	validateSignedMessage(signedMessage) {
		if (this.#publicKey === null) throw new Error("Public key not defined");

		const verifier = Crypto.createVerify(HASH_ALGO);
		const result = verifier.verify(this.#publicKey, signedMessage, SIG_TYPE);
		return result;
	}
}

export default Keystore;
