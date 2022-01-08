import React from 'react'
import { render } from 'react-dom'
import { createInertiaApp } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'
import { LoginLayout, AppLayout } from '../layouts'

InertiaProgress.init()

createInertiaApp({
  resolve: name => {
    const page = require(`../pages/${name}`).default
    if(page.layout === undefined) {
      page.layout = name.startsWith('Public/') ? LoginLayout : AppLayout
    }
    return page
  },
  setup({ el, App, props }) {
    render(<App {...props} />, el)
  },
})
