/*


 */
const assert = require('assert')

class Something {
  constructor() {}
  somefunc(input) {
    return 5
  }
}

module.exports = {
  Something
}

if (require.main === module) {
  const something = new Something()

  let input = ``
  let output = something.somefunc(input)
  console.log(output)
  assert.equal(output, 5)

  console.log('======')

}