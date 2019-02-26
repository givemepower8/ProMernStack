# Pro Mern Stack

The original code is in [pro-mern-stack](https://github.com/vasansr/pro-mern-stack) but it does not a demo site. This code is hosted on <http://promernstack.gingerstudio.net>

## Packages

- `node --version`
- `npm --version`
- `webpack -v`

Install express

`npm install express --save`

`npm install body-parser --save`

MongoDB

`npm install mongodb --save`

Babel 6

`npm install -D babel-cli babel-preset-react babel-preset-env`

`node_modules\.bin\babel --version` or `npx babel --version`

compile

`node_modules\.bin\babel src --presets react,env --out-dir static`

`npx babel src --presets react,env --out-dir static`

watch

`node_modules\.bin\babel src –presets react,env –out-dir static –watch`

`node server.js`

Babel 7

[react-webpack-babel](https://www.valentinog.com/blog/react-webpack-babel/)

npm install -D nodemon

```json
{
  // ...
  "scripts": {
    "start": "nodemon -w server.js server.js"
  }
  // ...
}
```

The –w command line option is to tell nodemon which files to watch for changes.

If you don't supply the command line option, it would have watched for changes in any file in the current directory and subdirectories. Thus, it would have restarted even when front-end code changed, and that's not what you want. The above example only watches for changes in server.js file.

webpack

`npm install -D webpack`
