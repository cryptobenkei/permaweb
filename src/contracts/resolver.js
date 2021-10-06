/* eslint-disable */
export function handle (state, action) {
  const canEvolve = state.canEvolve
  const input = action.input
  const caller = action.caller
  const authors = state.authors
  const nfts = state.nfts
  const owner = state.owner

  if (input.function === 'getOwner') {
    return { result: { owner: state.owner  } }
  }

  if (input.function === 'addAuthor') {
	if (caller !== owner) throw new ContractError(`Not authorized`)
	if (typeof input.author !== 'string') throw new ContractError(`Invalid author name`)
	if (input.author.length < 4 || input.author.length > 12) throw new ContractError(`Invalid author length (3-18)`)
	if (input.author in authors) throw new ContractError(`Author already exists`)
	authors[input.author] = input.address
    return { state }
  }

  if (input.function === 'getAuthor') {
	const address = state.authors[input.author] || false
    return { result: { author: input.author, address } }
  }

  if (input.function === 'addNft') {
	const address = state.authors[input.author] || false
	if (address === false) throw new ContractError(`Invalid author`)
	if (address !== caller) throw new ContractError(`Not authorized`)
	if (!nfts[input.chainId])
	  nfts[input.chainId] = {};
	if (!nfts[input.chainId][input.address])
	  nfts[input.chainId][input.address] = {};
	nfts[input.chainId][input.address][input.author] = input.ids;
    return { state }
  }

  if (input.function === 'getNft') {
	const ids = state.nfts[input.chainId][input.address] || false
	let res = '';
	for (author in ids) {
	  if (ids[author] === 'all')
        return { result: {author}}
	  else {
		const id = ids[author].split('-');
        return { result: {author: author, ids: ids[author], id}}
	  }
	}
	/*
	if (nft === false) throw new ContractError(`Invalid nft`)
	for (let i=0; i<nft.ids.length) {
	  if (nfts.ids[i] === input.tokenId) {
        return { result: { author: nfts.ids[i] } }
	  }
	}
	*/
    return { result: {author: false}}
  }

  if(input.function === 'evolve' && canEvolve) {
    if(state.owner !== caller) {
      throw new ContractError('Only the owner can evolve a contract.');
    }

    state.evolve = input.value
    return { state }
  }

  throw new ContractError(`No function supplied or function not recognised: "${input.function}"`)
}
/* eslint-enable */
