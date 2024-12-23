import React from 'react'
import { Heading, Link } from '@/Components'
import { Form, Field, TextInput, PasswordInput, Checkbox, Submit } from '@/Components/Form'
import { Routes } from '@/lib'
import { type UseFormProps } from 'use-inertia-form'
import useStore from '@/lib/store'
import { LAYOUTS } from '@/Layouts'

import cx from 'clsx'
import * as classes from './Login.css'

type LoginFormData = {
	user: {
		email: string
		password: string
		remember_me: boolean
	}
}

const defaultData = {
	user: {
		email: '',
		password: '',
		remember_me: false,
	},
}

const Login = () => {
	const { siteTitle } = useStore()

	const handleSubmit = ({ data }: UseFormProps<LoginFormData>) => {
		if(data.user.email === '' || data.user.password === '') {
			return false
		}
	}

	return (
		<Form model="user" data={ defaultData } to={ Routes.newUserSession() } onSubmit={ handleSubmit } className={ cx(classes.form) }>

			<div>
				<Heading mb="xs">{ siteTitle }</Heading>
			</div>

			<Field>
				<TextInput
					name="email"
					placeholder="Email"
					autoFocus
					autoComplete="Email"
					required
					pattern=".+@.+\..+"
				/>
			</Field>

			<Field>
				<PasswordInput
					name="password"
					placeholder="Password"
					autoComplete="current-password"
					required
				/>
			</Field>

			<Field>
				<Submit>Log In</Submit>
			</Field>

			<Field>
				<Checkbox name="remember_me" label="Remember Me" />
			</Field>

			<Link href={ Routes.newUserPassword() }>Reset Password</Link>
			<Link href={ Routes.newUserRegistration() }>Register</Link>

		</Form>
	)
}

Login.defaultLayout = LAYOUTS.auth

export default Login
