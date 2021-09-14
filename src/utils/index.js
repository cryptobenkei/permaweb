/*
 * Execution a function by its name
 *
 * @param {string} functionName
 * @param o
 */
function executeFunction(functionName, context , args ) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}

module.exports = {executeFunction}
