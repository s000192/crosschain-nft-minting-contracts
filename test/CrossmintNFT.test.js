const { expect } = require("chai")
const { ethers: { getSigners, utils } } = require("hardhat")

describe("CrossmintNFT", function () {
    beforeEach(async function () {
        [this.minter] = await getSigners()
        console.log("MINTER: ", this.minter.address)
        // use this chainId
        this.chainId = 123

        // create a LayerZero Endpoint mock for testing
        const LayerZeroEndpointMock = await ethers.getContractFactory("LZEndpointMock")
        this.lzEndpointMock = await LayerZeroEndpointMock.deploy(this.chainId)

        // create a ERC20 mock for testing
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock")
        this.erc20Mock = await ERC20Mock.deploy("Mock", "MOCK")
        await this.erc20Mock.mint(this.minter.address, utils.parseEther("10000"))

        // create CrossmintNFT instances
        const CrossmintNFT = await ethers.getContractFactory("CrossmintNFT")
        this.crossmintNFT = await CrossmintNFT.deploy(this.lzEndpointMock.address, "CrossmintNFT", "CROSSMINT")

        // create PaymentGateway instances
        const PaymentGateway = await ethers.getContractFactory("PaymentGateway")
        this.paymentGateway = await PaymentGateway.deploy(this.lzEndpointMock.address, this.erc20Mock.address, utils.parseEther("0.1"))

        this.lzEndpointMock.setDestLzEndpoint(this.crossmintNFT.address, this.lzEndpointMock.address)
        this.lzEndpointMock.setDestLzEndpoint(this.paymentGateway.address, this.lzEndpointMock.address)

        // set each contracts source address so it can send to each other
        this.crossmintNFT.setTrustedRemote(
            this.chainId,
            ethers.utils.solidityPack(["address", "address"], [this.paymentGateway.address, this.crossmintNFT.address])
        )
        this.paymentGateway.setTrustedRemote(
            this.chainId,
            ethers.utils.solidityPack(["address", "address"], [this.crossmintNFT.address, this.paymentGateway.address])
        )
    })

    it("cross mint nft on another chain", async function () {
        // ensure balance is 0
        expect(await this.crossmintNFT.balanceOf(this.minter.address)).to.be.equal(0) // initial value

        await this.erc20Mock.approve(this.paymentGateway.address, utils.parseEther("0.1"))
        await this.paymentGateway.crossmint(this.chainId, { value: ethers.utils.parseEther("0.5") })
        expect(await this.crossmintNFT.balanceOf(this.minter.address)).to.be.equal(1) // now its 1

        await this.erc20Mock.approve(this.paymentGateway.address, utils.parseEther("0.1"))
        await this.paymentGateway.crossmint(this.chainId, { value: ethers.utils.parseEther("0.5") })
        expect(await this.crossmintNFT.balanceOf(this.minter.address)).to.be.equal(2) // now its 2
    })
})
