task(
  "setTrustedRemote",
  "setTrustedRemote(chainId, sourceAddr) to enable inbound/outbound messages with your other contracts",
  require("./setTrustedRemote")
).addParam("targetNetwork", "the target network to set as a trusted remote")
  .addOptionalParam("localContract", "Name of local contract if the names are different")
  .addOptionalParam("remoteContract", "Name of remote contract if the names are different")
  .addOptionalParam("contract", "If both contracts are the same name")

task("mintERC20", "mint mock erc20 tokens", require("./mintERC20")).addParam("addr", "the address of the mock erc20 contract")

task("crossmint", "mint NFT on remote chain with erc20 on local chain", require("./crossmint")).addParam("targetNetwork", "the chainId to transfer to")