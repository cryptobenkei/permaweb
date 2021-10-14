/* eslint-disable */
export function handle (state, action) {
  if (action.input.function === 'getOwner') {
    return { result: { owner: state.owner, test: 5, counter:state.counter  } }
  }
  if (action.input.function === 'addAuthor') {
    state.counter = 1
    return { state }
  }
}
/* eslint-enable */
