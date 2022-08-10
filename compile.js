const path = require("path"); // path module (ensures cross-platform compatibility)
const fs = require("fs"); // file system module
const solc = require("solc"); // Solidity compiler

// __dirname is a node-defined constant
// __dirname is always set to the current working directory
const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

// Specify that the input format
const input = {
	language: "Solidity",
	sources: {
		"Inbox.sol": {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["*"],
			},
		},
	},
};

// this statement compiles our source code
// module.exports allows us to export our compiled code
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
	"Inbox.sol"
].Inbox;
