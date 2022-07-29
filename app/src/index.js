import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function() {
        const { web3 } = this;

        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = starNotaryArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                starNotaryArtifact.abi,
                deployedNetwork.address,
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    setStatus: function(message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },

    createStar: async function() {
        const { createStar } = this.meta.methods;
        const name = document.getElementById("starName").value;
        const id = document.getElementById("starId").value;
        await createStar(name, id).send({ from: this.account });
        App.setStatus("New Star Owner is " + this.account + ".");
    },

    // Implement Task 4 Modify the front end of the DAPP
    lookUp: async function() {
        const { lookUptokenIdToStarInfo } = this.meta.methods;
        const name = document.getElementById("lookid").value;
        await lookUptokenIdToStarInfo(name).call();
        App.setStatus("This star belongs to " + this.account + ".");
    },
    starName: async function() {
        const { tokenName } = this.meta.methods;
        const _tokenName = document.getElementById("nameId").value;
        await tokenName(_tokenName).call();
        document.getElementById("starName").innerHTML;

    },
    starSymbol: async function() {
        const { tokenSymbol } = this.meta.methods;
        const _tokenSymbol = document.getElementById("symbolId").value;
        await tokenSymbol(_tokenSymbol).call();
        document.getElementById("starSymbol").innerHTML;

    },
    _exchangeStars: async function() {
        const { exchangeStars } = this.meta.methods;
        const starId1 = document.getElementById("lookid1").value;
        const starId2 = document.getElementById("lookid2").value;
        await exchangeStars(starId1, starId2).send({ from: this.account });
        App.setStatus(this.account + "has succesfully exchanged star");
    },
    _transferStars: async function() {
        const { transferStar } = this.meta.methods;
        const idToTransfer = document.getElementById("idOfStar").value;
        const receivingAccount = document.getElementById("receivingAccount").value;
        await transferStar(receivingAccount, IdToTransfer, { from: this.account });
        App.setStatus(this.account + "just transferred star with Id: " + { idToTransfer });
    },

};

window.App = App;

window.addEventListener("load", async function() {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live", );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"), );
    }

    App.start();
});