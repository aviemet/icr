import { Box, Grid, Heading, Link } from '@/Components'
import { Form, TextInput, PasswordInput, Submit, Field } from '@/Components/Form'
import { Routes } from '@/lib'
import { type UseFormProps } from 'use-inertia-form'
import { LAYOUTS } from '@/Layouts'
import { AuthPaperLayout } from '@/Features'

type TRegisterFormData = {
	user: {
		email: string
		password: string
		password_confirmation: string
	}
}

const Register = () => {
	const handleFormChange = ({ data }: UseFormProps<TRegisterFormData>) => {
		// console.log({ data })
	}

	const handlePasswordChange = (value: string | number, { data, getError, clearErrors }: UseFormProps<TRegisterFormData>) => {
		if(getError('user.password') || getError('user.password_confirmation')) {
			if(data.user.password === data.user.password_confirmation) {
				clearErrors('user.password')
				clearErrors('user.password_confirmation')
			}
		}
	}

	const handleSubmit = ({ data, setError, errors, transform }: UseFormProps<TRegisterFormData>) => {
		if(data.user.password !== data.user.password_confirmation) {
			setError('user.password_confirmation', 'Passwords must match')
			return false
		}
	}

	const handleEmailBlur = (value: string | number, form: UseFormProps<TRegisterFormData>) => {
		// console.log({ value, form })
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserSession() } key="login">
				Log In Instead
			</Link>,
		] }>
			<Form
				data={ {
					user: {
						email: '',
						password: '',
						password_confirmation: '',
					},
				} }
				model="user"
				to={ Routes.userRegistration() }
				onChange={ handleFormChange }
				onSubmit={ handleSubmit }
			>
				<Grid>

					<Grid.Col>
						<Box>
							<Heading>Sign Up</Heading>
						</Box>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="email"
								placeholder="Email"
								autoFocus
								autoComplete="Email"
								required
								onBlur={ handleEmailBlur }
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<PasswordInput
								name="password"
								placeholder="Password"
								autoComplete="new-password"
								required
								onChange={ handlePasswordChange }
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<PasswordInput
								name="password_confirmation"
								placeholder="Confirm Password"
								autoComplete="new-password"
								required
								onChange={ handlePasswordChange }
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field mb={ 16 }>
							<Submit className="large">Sign Up</Submit>
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

Register.defaultLayout = LAYOUTS.auth

export default Register
