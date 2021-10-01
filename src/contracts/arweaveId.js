// Simple NS to verify Authorship of on-chain assets.

export function handle (state, action) {
  if (action.input.function === 'register') {
    if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
      throw new ContractError(`Invalid name provided: ${action.input.name}`)
    }
    if (typeof action.input.publicKey !== 'string') {
      throw new ContractError('Must provide data to be associated with the name')
    }
    if (state.names[action.input.name]) {
      throw new ContractError('Name already registered')
    }
    state.names[action.input.name] = {
      ownedBy: action.caller,
      publicKey: action.input.publicKey,
    }

    return { state }
  }
}
