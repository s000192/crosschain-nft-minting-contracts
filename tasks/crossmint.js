const CHAIN_ID = require("../constants/chainIds.json")
const ENDPOINTS = require("../constants/layerzeroEndpoints.json");

module.exports = async function (taskArgs, hre) {
    const remoteChainId = CHAIN_ID[taskArgs.targetNetwork]
    const erc20 = await hre.ethers.getContract("ERC20Mock")
    const paymentGateway = await ethers.getContract("PaymentGateway")

    // quote fee with default adapterParams
    let adapterParams = hre.ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000]) // default adapterParams example

    let approveTx = await (
        await erc20.approve(
            paymentGateway.address,
            hre.ethers.utils.parseEther("0.1")
        )
    ).wait()
    console.log(`approve tx: ${approveTx.transactionHash}`)

    const endpoint = await hre.ethers.getContractAt("ILayerZeroEndpoint", ENDPOINTS[hre.network.name])
    let fees = await endpoint.estimateFees(remoteChainId, paymentGateway.address, "0x", false, adapterParams)
    console.log(`fees[0] (wei): ${fees[0]} / (eth): ${hre.ethers.utils.formatEther(fees[0])}`)

    let tx = await (
        await paymentGateway.crossmint(
            remoteChainId,
            { value: hre.ethers.utils.parseEther("0.0001") } // TODO: avoid hardcode
        )
    ).wait()
    console.log(`✅ Message Sent [${hre.network.name}] crossmint on destination CrossmintNFT @ [${remoteChainId}]`)
    console.log(`tx: ${tx.transactionHash}`)
}
