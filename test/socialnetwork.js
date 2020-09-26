const { default: Web3 } = require('web3')

 const SocialNetwork = artifacts.require('./socialNetwork.sol')

 require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
    let socialNetwork

    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            socialNetwork = await SocialNetwork.deployed()
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, 'Mastermind Social Network')
        })
    })

    describe('posts', async() => {

        let result, postCount

        it('creates post', async () => {
            result = await socialNetwork.createPost('this is my first post', { from: accounts, })
            postCount = await socialNetwork.postCount()
            //SUCCESS
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'it is correct')
            assert.equal(event.content, 'This is my first post', 'content is correct')
            assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            //failure
            await socialNetwork.createPost('', { from: author }).should.be.rejected;
            
        })

        it('list posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'it is correct')
            assert.equal(post.content, 'This is my first post', 'content is correct')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })

        it('allows users to tip posts', async () => {

            let oldAuthorBalance
            oldAuthorBalance = await web3.length.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
            result = await socialNetwork.tipPost(postCount, { from: tipper, value: Web3.utils.toWei('1', 'Ether') })

            //SUCCESS
            //assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'it is correct')
            assert.equal(event.content, 'This is my first post', 'content is correct')
            assert.equal(event.tipAmount, '10', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let tipAmount
            tipAmount = web3.utils.toWei('1', 'Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBalance = oldAuthorBalance.add(tipAmount)
            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            //Failure tries to tip a post that does not exist
            await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })

    })
})    