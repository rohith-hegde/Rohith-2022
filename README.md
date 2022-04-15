
# Code test

### validateSignedMessage() in 'keystore.js' does not work. The message is always unauthorized. I could not figure out how to fix the problem. It's probably an encoding mismatch.

## Run the server

`node server.js <password>`

## Run the client

`node client.js <password>`

```
Generated key pair.
Server accepted public key.
Please enter a message to send to the server: 
>>> hello server
<Throws a 401 error>
```
