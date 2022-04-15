import Express from "express";
import CliPasswordManager from "./server/cliPasswordManager.js";
import Keystore from "./server/keystore.js";

const pwdManager = new CliPasswordManager();
const keystore = new Keystore();

const webapp = Express();
webapp.use(Express.json());
const port = 8080;

webapp.put("/storePublicKey", (req, res) => {
	if (!req.body.password || !req.body.publicKey) {
		res.status(400).send("Invalid input");
		return;
	}

	const attemptPwd = req.body.password;

	if (!pwdManager.validatePassword(attemptPwd)) {
		res.status(401).send("Incorrect password");
		return;
	} else {
		keystore.setPublicKey(req.body.publicKey);
		res.status(200).send("Successfully changed public key");
	}
});

webapp.post("/sendSecureMessage", (req, res) => {
	if (!req.body.signedMessage) {
		res.status(400).send("Invalid input");
		return;
	}

	let result = keystore.validateSignedMessage(req.body.signedMessage);

	result
		? res.status(200).send("Message is authentic")
		: res.status(401).send("Message is fake");
});

webapp.listen(port, () => {
	console.log(`Application running on port ${port}`);
	console.log(`\t\tPUT /storePublicKey`);
	console.log(`\t\tPOST /sendSecureMessage`);
});
