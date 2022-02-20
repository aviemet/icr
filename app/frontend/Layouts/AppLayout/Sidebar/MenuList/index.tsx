import React from 'react'
import NavGroup from './NavGroup'
import menuItems from '@/Layouts/AppLayout/menuItems'

const MenuList = () => <>{ menuItems.map(item => <NavGroup key={ item.id } item={ item } />) }</>

export default MenuList
