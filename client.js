import Crypto, { sign } from "crypto";
import Axios from "axios";
import Readline from "readline";

const HASH_ALGO = "sha256";
const SERVER_URL = "http://localhost:8080/";

const { publicKey, privateKey } = Crypto.generateKeyPairSync("rsa", {
	modulusLength: 4096,
	publicKeyEncoding: {
		type: "spki",
		format: "pem",
	},
	privateKeyEncoding: {
		type: "pkcs8",
		format: "pem",
	},
});

console.log("Generated key pair.");

async function submitPublicKey(password, pubKey) {
	const submitInput = {
		password: password,
		publicKey: pubKey,
	};

	await Axios.put(`${SERVER_URL}storePublicKey`, submitInput);
}

const args =
	process.argv.length === 3 ? process.argv.slice(2, 3) : process.argv.slice(1, 2);

if (args.length !== 1) throw new Error(`Invalid arguments`);

const password = args[0];

try {
	await submitPublicKey(password, publicKey);
	console.log("Server accepted public key.");
} catch (err) {
	console.error(`Error while submitting public key: ${err}`);
	process.exit(1);
}

const inquirer = Readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function signMessage(messagePlain) {
	const signer = Crypto.createSign(HASH_ALGO);
	signer.update(messagePlain);

	const signedMsg = signer.sign(privateKey);
	// signer.end();
	return signedMsg;
}

function submitMessage(messageSigned) {
	const submitInput = {
		signedMessage: messageSigned,
	};

	Axios.post(`${SERVER_URL}sendSecureMessage`, submitInput).then((res) =>
		console.log(`Message result: ${res}`)
	);
}

inquirer.question(
	"Please enter a message to send to the server: ",
	(messagePlain) => {
		const signedMessage = signMessage(messagePlain);
		submitMessage(signedMessage);
	}
);
