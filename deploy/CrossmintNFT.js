const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    // get the Endpoint address
    const endpointAddr = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`)

    await deploy("CrossmintNFT", {
        from: deployer,
        args: [endpointAddr, "CrossmintNFT", "CROSSMINT"],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["CrossmintNFT"]
