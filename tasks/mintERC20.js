module.exports = async function (taskArgs, hre) {
    const erc20 = await ethers.getContract("ERC20Mock")
    const [signer] = await hre.ethers.getSigners()
    let tx = await (await erc20.mint(signer.address, hre.ethers.utils.parseEther("10000"))).wait()
    console.log(`mint tx: ${tx.transactionHash}`)
}
