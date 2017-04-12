import {assert, should} from 'chai'
import {ERROR} from '../../src/config'
import * as types from '../../src/types_new'
should()


// Constants

const TESTS = [
  ['default', 2000, 2000],
  ['default', '2000', 2000],
  ['default', -2000, ERROR],
  ['default', 20000, ERROR],
  ['default', '3.14', ERROR],
  ['default', '', ERROR],
]

// Tests

describe('castYear', () => {

  TESTS.forEach(test => {
    const [format, value, result] = test
    it(`format "${format}" should cast "${value}" to "${result}"`, () => {
        assert.deepEqual(types.castYear(format, value), result)
    })
  })

})
