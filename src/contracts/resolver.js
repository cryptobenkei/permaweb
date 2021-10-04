
export function handle (state, action) {
  const canEvolve = state.canEvolve
  const owner = state.owner
  const input = action.input
  const caller = action.caller

  if (input.function === 'addOwner') {
    return { state }
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
