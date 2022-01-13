# SLS Scheduling Application

## Conventions

Use Radix primitives for components not present in Material UI Tailwind

[https://www.radix-ui.com/docs/primitives/overview/introduction](https://www.radix-ui.com/docs/primitives/overview/introduction)

## Debugging

Use to increase log depth for server side node output:

    const util = require('util')
    
    console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
    
    // alternative shortcut
    console.log(util.inspect(myObject, false, null, true /* enable colors */))
