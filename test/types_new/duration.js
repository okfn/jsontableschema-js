import moment from 'moment'
import {assert, should} from 'chai'
import {ERROR} from '../../src/config'
import * as types from '../../src/types_new'
should()


// Constants

const TESTS = [
  ['default', moment.duration({years: 1}), moment.duration({years: 1})],
  ['default', 'P1Y10M3DT5H11M7S',
    moment.duration({years: 1, months: 10, days: 3, hours: 5, minutes: 11, seconds: 7})],
  ['default', 'P1Y', moment.duration({years: 1})],
  ['default', 'P1M', moment.duration({months: 1})],
  ['default', 'P1M1Y', ERROR],
  // ['default', 'P-1Y', ERROR],
  ['default', 'year', ERROR],
  ['default', true, ERROR],
  ['default', false, ERROR],
  ['default', 1, ERROR],
  ['default', '', ERROR],
  ['default', [], ERROR],
  ['default', {}, ERROR],
]

// Tests

describe('castDuration', () => {

  TESTS.forEach(test => {
    const [format, value, result] = test
    it(`format "${format}" should cast "${value}" to "${result}"`, () => {
        assert.deepEqual(types.castDuration(format, value), result)
    })
  })

})
