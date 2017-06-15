'use strict'

const visibilityPlugin = require('./')
const expect = require('chai').expect
const Model = require('objection').Model
const Knex = require('knex')

describe('objection-timestamp test', () => {
  let knex

  before(() => {
    knex = Knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test.db'
      }
    })
  })

  before(() => {
    return Promise.all([
      knex.schema.createTable('user', table => {
        table.increments('id').primary()
        table.string('firstName')
        table.string('lastName')
        table.string('hashedPassword')
      }),
      knex.schema.createTable('post', table => {
        table.increments('id').primary()
        table.string('title')
        table.string('slug')
        table.string('description')
      }),
    ])
  })

  after(() => {
    return Promise.all([
      knex.schema.dropTable('user'),
      knex.schema.dropTable('post')
    ])
  })

  after(() => {
    return knex.destroy()
  })

  beforeEach(() => {
    return Promise.all([
      knex('user').delete(),
      knex('post').delete()
    ])
  })

  it('should not show blacklisted properties when serialized to json', () => {
    class User extends visibilityPlugin(Model) {
      static get tableName () {
        return 'user'
      }
      static get hidden () {
        return ['hashedPassword']
      }
    }

    return User
      .query(knex)
      .insert({firstName: 'John', lastName: 'Doe', hashedPassword: 'my secret'})
      .then(john => {
        expect(john).to.have.property("hashedPassword")
        expect(john.toJSON()).to.not.have.property("hashedPassword")
      })
  })

  it('should only show whitelisted properties when serialized to json', () => {
    class User extends visibilityPlugin(Model) {
      static get tableName () {
        return 'user'
      }
      static get visible () {
        return ['firstName', 'id']
      }
    }

    return User
      .query(knex)
      .insert({firstName: 'jane', lastName: 'Doe', hashedPassword: 'my secret2'})
      .then(jane => {
        let serialized = jane.toJSON()
        expect(serialized).to.have.property("firstName", "jane")
        expect(serialized).to.have.property("id")
        expect(serialized).to.not.have.property("lastName")
        expect(serialized).to.not.have.property("hashedPassword")
      })
  })

  // just to be sure :)
  it('should work when applying to a base class model', () => {
    class Base extends visibilityPlugin(Model) {}

    class User extends Base {
      static get tableName () {
        return 'user'
      }
      static get hidden () {
        return ['hashedPassword', 'id']
      } 
    }

    class Post extends Base {
      static get tableName () {
        return 'post'
      }
    }

    return User
      .query(knex)
      .insert({firstName: 'joe', lastName: 'doe', hashedPassword: 'another secret'})
      .then(joe => {
        let serialized = joe.toJSON()
        expect(serialized).to.not.have.property("hashedPassword")
        expect(serialized).to.not.have.property("id")
      })
      .then(() => Post.query(knex).insert({ title: 'my first post' }))
      .then(post => {
        let serialized = post.toJSON()
        expect(serialized).to.have.property("id")
        expect(serialized).to.have.property("title")
      })
  })
})
