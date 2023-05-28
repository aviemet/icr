import React from 'react'
import { Routes } from '@/lib'
import { NewIcon } from '@/Components/Icons'
import UsersTable from '../Table'

interface IUserIndexProps {
	users: Schema.User[]
	pagination: Schema.Pagination
}

const UserIndex = ({ users, pagination }: IUserIndexProps) => {
	return (
		<UsersTable />
	)
}

export default UserIndex
