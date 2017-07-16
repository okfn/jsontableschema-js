/* global describe, it, beforeEach */
const { assert } = require('chai')
const fetchMock = require('fetch-mock')
const {validate} = require('../src')


// Tests

let SCHEMA
describe('Validate', () => {
  beforeEach(done => {
    fetchMock.restore()
    SCHEMA = {
      fields: [
        {
          name: 'id',
          type: 'string',
          constraints: { required: true }
        },
        {
          name: 'height',
          type: 'number'
        }, {
          name: 'age',
          type: 'integer'
        }, {
          name: 'name',
          type: 'string',
          constraints: { required: true }
        }, {
          name: 'occupation',
          type: 'string'
        }
      ],
      primaryKey: ['id']
    }
    done()
  })

  it('ensure schema has fields', done => {
    SCHEMA = {}
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('ensure schema has fields and fields are array', done => {
    SCHEMA = { fields: ['1', '2'] }
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 2)
      done()
    })
  })

  it('ensure schema fields has required properties', done => {
    SCHEMA = {
      fields: [
        {
          name: 'id',
          type: 'number'
        },
        {
          type: 'number'
        }
      ]
    }

    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('ensure schema fields constraints must be an object', done => {
    SCHEMA = {
      fields: [
        {
          name: 'id',
          type: 'string',
          constraints: 'string'
        },
        {
          name: 'height',
          type: 'number'
        }
      ]
    }

    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('ensure constraints properties have correct type', done => {
    SCHEMA = {
      fields: [{
        name: 'id',
        type: 'string',
        constraints: {
          required: 'string',
          unique: 'string',
          pattern: 1,
          minimum: 10,
          maximum: 20
        }
      },
      {
        name: 'age',
        type: 'integer',
        constraints: {
          required: 'string',
          unique: 'string',
          minLength: true,
          maxLength: true,
          minimum: 'string',
          maximum: 'string'
        }
      }
      ]
    }

    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      // assert.equal(errors.length, 7)
      done()
    })
  })

  it('ensure constraints properties with correct type is valid', done => {
    SCHEMA = {
      fields: [{
        name: 'id',
        type: 'string',
        constraints: {
          required: true,
          pattern: '/.*/',
          unique: true
        }
      }, {
        name: 'age',
        type: 'integer',
        constraints: {
          required: true,
          unique: true,
          minimum: '10',
          maximum: '20'
        }
      }
      ]
    }

    validate(SCHEMA).then(valid => {
      assert.isTrue(valid)
      done()
    }).catch(errors => {
      assert.isNull(errors)
      done()
    })
  })

  it('primary key should be by type one of the allowed by schema', done => {
    SCHEMA.primaryKey = { some: 'thing' }
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('primary key should match field names', done => {
    SCHEMA.primaryKey = ['unknown']
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('ensure primary key as array match field names', done => {
    SCHEMA.primaryKey = ['id', 'unknown']
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('ensure foreign keys is an array', done => {
    SCHEMA.foreignKeys = 'keys'
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 1)
      done()
    })
  })

  it('ensure every foreign key has fields', done => {
    SCHEMA.foreignKeys = ['key1', 'key2']
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 2)
      done()
    })
  })

  it.skip('ensure fields in keys a string or an array', done => {
    SCHEMA.foreignKeys = [{ fields: { name: 'id' } }]
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 2)
      done()
    })
  })

  it('ensure fields exists in schema', done => {
    SCHEMA.foreignKeys = [
      {
        fields: ['unknown'],
        reference: {
          fields: ['fk_id'],
          resource: 'resource'
        }
      }, {
        fields: ['id', 'unknown'],
        reference: {
          resource: 'the-resource',
          fields: ['fk_id', 'fk_name']
        }
      }
    ]
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 2)
      done()
    })
  })

  it.skip('fields in keys a string or an array and resource key should present', done => {
    SCHEMA.foreignKeys = [
      {
        fields: ['id'],
        reference: {
          fields: [{ name: 'id' }],
          resource: 'resource'
        }
      }, {
        fields: ['id'],
        reference: {
          resource: 'resource'
        }
      }, {
        fields: ['id', 'name'],
        reference: {
          fields: ['fk_id', 'fk_name']
        }
      }
    ]
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 3)
      done()
    })
  })

  it('reference.fields should be same type as key.fields', done => {
    SCHEMA.foreignKeys = [
      {
        fields: ['id'],
        reference: {
          fields: ['id', 'name'],
          resource: 'resource'
        }
      }, {
        fields: ['id', 'name'],
        reference: {
          resource: 'resource',
          fields: ['id']
        }
      }, {
        fields: ['id', 'name'],
        reference: {
          resource: 'resource',
          fields: ['id']
        }
      }
    ]
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 3)
      done()
    })
  })

  it('ensure fields in keys a string or an array and resource key is present', done => {
    SCHEMA.foreignKeys = [
      {
        fields: ['id'],
        reference: {
          fields: ['fk_id'],
          resource: 'resource'
        }
      }, {
        fields: ['id', 'name'],
        reference: {
          resource: 'the-resource',
          fields: ['fk_id', 'fk_name']
        }
      }
    ]
    validate(SCHEMA).then(valid => {
      assert.isTrue(valid)
      done()
    }).catch(errors => {
      assert.isNull(errors)
      done()
    })
  })

  it('empty foreignKeys.reference.resource should reference to the self fields', done => {
    SCHEMA.foreignKeys = [
      {
        fields: ['id'],
        reference: {
          fields: ['fk_id'],
          resource: ''
        }
      }, {
        fields: ['id', 'name'],
        reference: {
          fields: ['fk_id', 'fk_name'],
          resource: ''
        }
      }
    ]
    validate(SCHEMA).then(valid => {
      assert.isFalse(valid)
      done()
    }).catch(errors => {
      assert.isArray(errors)
      assert.equal(errors.length, 3)
      done()
    })
  })
})
