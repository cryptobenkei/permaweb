/* eslint-disable */
/*
 * Execution a function by its name
 *
 * @param {string} functionName fn to be executed
 * @param {object} context Context
 * @param {array} args Arguments
 */
function executeFunction(functionName, context, args) {
  var args = Array.prototype.slice.call(arguments, 2);
  const namespaces = functionName.split('.');
  const func = namespaces.pop();
  for (let i = 0; i < namespaces.length; i += 1) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}
/* eslint-enable */

module.exports = { executeFunction };
