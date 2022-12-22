const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const {
    ethers: {
        utils: { parseEther },
    },
} = require("hardhat");

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, get } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    // get mock erc20 token address
    const erc20Mock = await get("ERC20Mock");

    // get the Endpoint address
    const endpointAddr = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`)

    await deploy("PaymentGateway", {
        from: deployer,
        args: [endpointAddr, erc20Mock.address, parseEther("0.1")],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["PaymentGateway"]
