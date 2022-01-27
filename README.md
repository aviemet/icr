# SLS Scheduling Application

## Conventions

Using Vite with the dynamic import plugin for rollup requires dynamic imports to be explicitly defined by path depth and must end with a file extension:

```javascript
// Not allowed
import(bar)
import(`${bar}.js`)
import(`/foo/${bar}.js`)
import(`some-library/${bar}.js`)

// allowed
import(`./foo/${bar}.js`)
```

The dynamic imports for Inertia have been explicitly defined in `app/frontend/dynamicImports.ts` to adhere to these requirements, which imposes specific constraints on folder structure.

* All entrypoints must be an `index.tsx` file in a directory named for the route
* Maximum depth of 3 folder levels for any page entrypoint

## Debugging

Use to increase log depth for server side node output for debugging webpack:

```javascript
const util = require('util')

console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))

// alternative shortcut
console.log(util.inspect(myObject, false, null, true /* enable colors */))
```
