const fs = require('fs')

const Instagram = artifacts.require("Instagram");

let instagramaddress = ""

module.exports = async function (deployer) {
    await deployer.deploy(Instagram);
    const instance = await Instagram.deployed();
    instagramaddress = await instance.address;
    console.log("instagram addresi eşittir= ", instagramaddress)

    let config = `export const instagramaddress = "${instagramaddress}"`

    let data = JSON.stringify(config)
    await fs.writeFileSync('config.js', JSON.parse(data))
};


