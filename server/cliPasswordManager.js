import Crypto from "crypto";

const HASH_ALGO = "sha256";

/**
 * Manages password authentication
 */
class CliPasswordManager {
	#correctHashedPwd = null; // ""
	#pwdSalt = Crypto.randomBytes(64); //protects against a rainbow table attack

	/**
	 * Initializes the password manager
	 */
	constructor() {
		const args =
			process.argv.length === 3
				? process.argv.slice(2, 3)
				: process.argv.slice(1, 2);

		if (args.length !== 1) throw new Error(`Invalid arguments`);

		const cliPwdPlain = args[0];
		if (cliPwdPlain === "") throw new Error(`Empty password`);

		this.#correctHashedPwd = this.#convertPlainToHash(cliPwdPlain);
	}

	/**
	 * Hashes a plaintext password with a salt
	 */
	#convertPlainToHash(plainPwd) {
		const hasher = Crypto.createHmac(HASH_ALGO, this.#pwdSalt);
		const hashed = hasher.update(plainPwd).digest("hex");
		return hashed;
	}

	/**
	 * Validates an incoming password attempt (true/false)
	 */
	validatePassword(plainPwd) {
		if (this.#correctHashedPwd === null) throw new Error("Password not defined");

		return this.#convertPlainToHash(plainPwd) === this.#correctHashedPwd;
	}
}

export default CliPasswordManager;
export { HASH_ALGO };
