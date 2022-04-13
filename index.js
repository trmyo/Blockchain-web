const express = require("express");
const sha256 = require("sha256");
const bodyParser = require("body-parser");

class Block {
    constructor(index, data, prevHash) {
        this.index= index;
        this.timestamp = Date.now();
        this.data = data;
        this.prevHash = prevHash;
        this.currHash = this.mineBlock()
    }

    mineBlock() {
        var nonce = 0
        var hash = ""

        while(!this.verfiyHash(hash)) {
            hash = sha256(nonce + this.data)
            nonce += 1
        }

        return hash
    }

    verfiyHash(hash) {
        return (hash.startsWith("0" * 3))
    }
}


class Blockchain {
    constructor() {
        console.log("Called inint Blockchain")
        this.blockchain= [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(0, "Geneis Block", '0')
    }

    addNewBlock(data) {
        var block = new Block(this.getLastBlockindex() + 1, data, this.getLastBlockHash())
        this.blockchain.push(block)
    }

    getLastBlockindex() {
        return this.blockchain[this.blockchain.length -1].index;
    }

    getLastBlockHash() {
        return this.blockchain[this.blockchain.length -1].currHash;
    }
}

var blockchain = new Blockchain()
blockchain.addNewBlock("First Block")
// console.log(blockchain.blockchain)

// express side
var app = express();
app.use(bodyParser.json({ type: '*' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "hbs");
app.set("views", __dirname)

app.get('/', (req, res) => {
	res.render('index', {blockchain: blockchain.blockchain})
});

app.post("/", (req, res) => {
    console.log(req.body)
    blockchain.addNewBlock(req.body.data)
    res.render('index', {blockchain: blockchain.blockchain})
})

app.listen(3000, () => {
    console.log("Hey, the port is up and running. connect to http://localhost:3000")
});

app.listen(3000, () => {
    console.log("Hey, the port is up and running. connect to http://localhost:3000")
});
