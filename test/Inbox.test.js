const assert = require("assert");       // Std lib for making assertions about tests
const ganache = require("ganache-cli")  // This will serve as our local Ethereum test network

// This will be our constructor function
// Used to create instances of the web3 library
// By convention, constructor functions are capitalized
// Actual web3 instances will be lowercase
const Web3 = require("web3");

// web3 instance that connects to local test network
// Provider is needed for web3 instance to communicate with network
const web3 = new Web3(ganache.provider());

// Gives us access to ABI and bytecode from compiled object
const { abi, evm } = require('../compile');

//******** Tests ********//
let accounts;
let inbox;
const INITIAL_MESSAGE = "Hi there.";

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: "1000000" })
});

// deploy the contract
describe("Inbox", () => {

    // 1. Check that contract can be deployed
    it("deploys a contract", () => {
        // Check if address property exists after deployment
        // If address does not exists, the contract failed to deploy
        assert.ok(inbox.options.address);
    });

    // 2. Check that initialMessage is defined
    it("has a default message", async () => {
        // .call is similar to GET
        // Returns data we requested
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    // 3. Check that we can change the message via setMessage
    it("can change the message", async () => {
        // .send is similar to POST or PATCH
        // Account specified in "from" field pays for the transaction
        // Returns the trasaction hash (similar to a receipt)
        await inbox.methods.setMessage("Bye.").send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, "Bye.");
    });

});








// // Test Example
// class Car {
//     park() {
//         return "stopped";
//     }

//     drive() {
//         return "vroom";
//     }
// }

// let car;
// beforeEach(() => {
//     car = new Car(); // instance of class Car
// });

// describe("Car", () => {
//     it("can park", () => {
//         assert.equal(car.park(), "stopped");  // call park() and check if it returns "stopped"
//     });

//     it("can drive", () => {
//         assert.equal(car.drive(), "vroom");  // call park() and check if it returns "stopped"
//     });
// });

// // when the same line is used for every test, we can use beforeEach() as shown above
// // describe("Car", () => {
// //     it("can park", () => {
// //         const car = new Car();                // instance of class Car
// //         assert.equal(car.park(), "stopped");  // call park() and check if it returns "stopped"
// //     });

// //     it("can drive", () => {
// //         const car = new Car();                // instance of class Car
// //         assert.equal(car.drive(), "vroom");  // call park() and check if it returns "stopped"
// //     });
// // });