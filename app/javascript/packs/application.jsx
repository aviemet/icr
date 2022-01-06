import React from 'react'
import { render } from 'react-dom'
import { createInertiaApp, App } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'

InertiaProgress.init()

createInertiaApp({
  resolve: name => require(`../Pages/${name}.jsx`).default,
  setup({ el, App, props }) {
    render(<App {...props} />, el)
  },
})

// const el = document.getElementById('app')

// render(
//   <App
//     initialPage="Home"
//     resolveComponent={name => import(`../Pages/${name}`).then(module => module.default)}
//   />,
//   el
// )
