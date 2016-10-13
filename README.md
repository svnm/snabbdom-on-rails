# [snabbdom-on-rails](https://github.com/StevenIseki/snabbdom-on-rails)

[![npm version](https://badge.fury.io/js/snabbdom-on-rails.svg)](https://badge.fury.io/js/snabbdom-on-rails)

`snabbdom-on-rails` JavaScript for `react_on_rails` Ruby gem allowing you to use snabbdom instead of react as your virtual dom.

## Install

```jsx
npm install snabbdom-on-rails --save
```

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

## Usage

An example below of rendering a simple component/function with `snabbdom-on-rails`. There is also an example project I am working on [here](https://github.com/StevenIseki/snabbdom_on_rails-example)

```jsx
/** @jsx html */
import { html } from 'snabbdom-jsx'
import ReactOnRails from 'snabbdom-on-rails'

const HelloMessage = ({name}) =>
  <div on-click={ _ => alert('Hi ' + name) }>
    {name}
  </div>;

const MyComponent = (props) => ( <HelloMessage {...props} /> )

ReactOnRails.register({ MyComponent })
```

This registered component can then be used in a rails view, like this, e.g. using haml:

```haml
= react_component('MyComponent', props: { name: 'Iseki' })
```

It will be nice if instead of `ReactOnRails.register` could use `SnabbdomOnRails.register`, this is a work in progress, at the moment this module just leaves alone all of the calls to register and render from the react_on_rails gem, but instead of rendering react components, renders snabbdom components. Happy to get some help from anyone who has some time and some more react_on_rails or snabbdom experience to help improve the current implementation.

## Development

    npm install
    npm run build
    npm test

## License

[MIT](http://isekivacenz.mit-license.org/)
