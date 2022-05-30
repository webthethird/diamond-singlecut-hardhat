/* global describe it before ethers */

const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets
} = require('../scripts/libraries/diamond.js')

const { deployDiamond } = require('../scripts/deploy.js')

const { assert } = require('chai')

describe('DiamondTest', async function () {
  let diamondAddress
  let diamondLoupeFacet
  let ownershipFacet
  let test2Facet
  let tx
  let receipt
  let result
  const addresses = []

  before(async function () {
    diamondAddress = await deployDiamond()
    test2Facet = await ethers.getContractAt('Test2Facet', diamondAddress)
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress)
    ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress)
  })

  it('should have three facets -- call to facetAddresses function', async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address)
    }

    assert.equal(addresses.length, 3)
  })

  it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
    let selectors = getSelectors(diamondLoupeFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(ownershipFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(test2Facet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2])
    assert.sameMembers(result, selectors)
  })

  it('selectors should be associated to facets correctly -- multiple calls to facetAddress function', async () => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress('0xcdffacc6')
    )
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress('0x01ffc9a7')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0xf2fde38b')
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress('0xea36b558')
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress('0xcaae8f23')
    )
  })

  it('should test function call', async () => {
    const test2Facet = await ethers.getContractAt('Test2Facet', diamondAddress)
    await test2Facet.test2Func10()
  })

})
