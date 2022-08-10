const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const INITIAL_MESSAGE = "Hi there.";

const provider = new HDWalletProvider(
	// Account mnemonic for account that will pay for deployment transaction
	process.env.ACCOUNT_MNEMONIC,

	// Infura API endpoint so that we can connect to node in public network (Rinkeby)
	process.env.INFURA_RINKEBY_NODE
);

// web3 instance that connects to public network (Rinkeby)
const web3 = new Web3(provider);

// function that allows us to use async/await structure
const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log("\nAttempting to deploy from account ", accounts[0], "\n");

	const result = await new web3.eth.Contract(abi)
		.deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
		.send({ gas: "1000000", from: accounts[0] });

	console.log(
		"\nContract deployed to address: ",
		result.options.address,
		"\n"
	);
	provider.engine.stop();
};
deploy();
