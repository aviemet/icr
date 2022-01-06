import React from 'react'
import { render } from 'react-dom'
import { createInertiaApp, App } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'
import Home from '../Pages/Home'

InertiaProgress.init()

const pages = import.meta.glob('../Pages/**/*.jsx')
console.log({ pages, Home })
// console.log(pages[`../Pages/Home.jsx`]())

// createInertiaApp({
//   resolve: name => Home(),
//   setup({ el, App, props }) {
//     render(<App {...props} />, el)
//   },
// })


const el = document.getElementById('app')

render(
  <App
    initialPage={JSON.parse(el.dataset.page)}
    resolveComponent={name => pages[`../Pages/${name}.jsx`]}
  />,
  el
)





// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log('Vite ⚡️ Rails')

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>
