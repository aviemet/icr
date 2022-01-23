# SLS Scheduling Application

## Conventions

## Debugging

Use to increase log depth for server side node output for debugging webpack:

    const util = require('util')
    
    console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
    
    // alternative shortcut
    console.log(util.inspect(myObject, false, null, true /* enable colors */))
