# SLS Scheduling Application

## Conventions

For dynamic tailwind class names, add a comment starting with `purgecss:` containing a list of all the possible full classnames

[https://www.viget.com/articles/a-better-approach-for-using-purgecss-with-tailwind/](https://www.viget.com/articles/a-better-approach-for-using-purgecss-with-tailwind/)

## Debugging

Use to increase log depth for server side node output:

    const util = require('util')
    
    console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
    
    // alternative shortcut
    console.log(util.inspect(myObject, false, null, true /* enable colors */))
