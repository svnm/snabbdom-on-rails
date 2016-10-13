## snabbdom-on-rails

[![npm version](https://badge.fury.io/js/snabbdom-on-rails.svg)](https://badge.fury.io/js/snabbdom-on-rails)

`snabbdom-on-rails` JavaScript for `react_on_rails` Ruby gem allowing you to use snabbdom instead of react as your virtual dom.

## Install

``` js
npm install snabbdom-on-rails --save
```

## Versions

#### `1.0.0` uses React `^0.15.1`

## Getting Started

The setup for using snabbdom-on-rails is the same as for react_on_rails, you will simply need to swap
the `react-on-rails` and `react` node modules for `snabbdom`, `snabbdom-jsx` and `snabbdom-on-rails` in your `package.json`.

1. Add the following to your Gemfile and bundle install.

  ```ruby
  gem "react_on_rails", "~> 5"
  ```

2. Commit this to git (you cannot run the generator unless you do this).

3. Run the generator with a simple "Hello World" example (more options below):

  ```bash
  rails generate react_on_rails:install
  ```

4. As mentioned, remove `react`, `react-router` and `react-on-rails` node modules for `snabbdom`, `snabbdom-jsx` and `snabbdom-on-rails` in your `package.json`. `snabbdom-to-html` also if you need server rendering.

  ```js
  "snabbdom": "^0.5.3",
  "snabbdom-jsx": "^0.3.1",
  "snabbdom-to-html": "^2.1.3",
  "snabbdom-on-rails": "^0.0.1",

  ```

5. Bundle and NPM install. Make sure you are on a recent version of node. Please use at least Node v5. Bundle is for adding execJs. You can remove that if you are sure you will not server render.

  ```bash
  bundle && npm install
  ```

6. Start your Rails server:

  ```bash
  foreman start -f Procfile.dev
  ```

7. Visit [localhost:3000/hello_world](http://localhost:3000/hello_world)

## Use

It will be nice if instead of `ReactOnRails.register` you can use `SnabbdomOnRails.register`, this is a work in progress, at the moment this module just leaves all of the hooks from the react_on_rails gem to call the react methods, but instead of rendering react components, it renders snabbdom components. At the moment this is a bit of a work in progress, very happy to get some help from anyone who has some time and some more rails or snabbdom experience.

Here is an example of rendering a simple component/function with `snabbdom-on-rails` and also there is an example project I am working on [here](https://github.com/StevenIseki/snabbdom_on_rails-example)

``` js
/** @jsx html */
import { html } from 'snabbdom-jsx';
import ReactOnRails from 'snabbdom-on-rails'

const HelloMessage = ({name}) =>
  <div on-click={ _ => alert('Hi ' + name) }>
    {name}
  </div>;

const MyComponent = (props) => ( <HelloMessage {...props} /> )

ReactOnRails.register({ MyComponent })
```

This component can then be used in a rails view, like this, e.g. using haml:

```haml
= react_component('MyComponent', props: { name: 'Iseki' })
```

## Development

    npm install
    npm run build
    npm test

## License

[MIT](http://isekivacenz.mit-license.org/)
