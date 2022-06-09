![workflow](https://github.com/oscaroox/objection-visibility/actions/workflows/node.js.yml/badge.svg)

# objection-visibility


This plugin adds the ability to whitelist or blacklists model properties.


## Installation

```bash
npm install objection-visibility
```

## Usage
You can enable this plugin by either setting the static property `hidden` or `visible` to your model.

It is possible to have a model which have both properties defined, note that the `visible` method is called first and the `hidden` method second. 


### Blacklist properties

To enable blacklisting on your model add the static property `hidden` on your model and return an array with the fields you want to blacklist.

The listed fields are gone after being serialized to json

```js
const Model = require('objection').Model
const visibilityPlugin = require('objection-visibility').default;

class User extends visibilityPlugin(Model) {
  static get hidden() {
    return ['hashed_password'];
  }
}

```

### Whitelist properties
To enable whitelisting on your model add a static property `visible` on your model and return an array with the fields you want to be whitelisted

The listed fields will be the only properties available after being serialized to json

```js
const Model = require('objection').Model
const visibilityPlugin = require('objection-visibility').default;

class User extends visibilityPlugin(Model) {
  static get visible() {
    return ['firstName', 'id']
  }
}
```

## Using with multiple models

Can be used on a base model and have it readily available on all your models

Models that dont have the static properties `visible` or `hidden` will remain untouched.

```javascript

    // base.js
    class BaseModel extends visibilityPlugin(Model) {}

    // post.js
    class Post extends BaseModel {
        static get visible () {
            return ['description', 'title']
        }
    }

    // user.js
    class User extends BaseModel {
        static get hidden () {
            return ['hashedPassword']
        }
    }
```
