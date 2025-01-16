import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TUserFormData = {
	user: Schema.UsersFormData
}

export interface UserFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TUserFormData>) => boolean|void
	user: Schema.UsersFormData
}

const UserForm = ({ method = 'post', user, ...props }: IUserFormProps) => {
	return (
		<Form
			model="user"
			data={ { user } }
			method={ method }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<Submit>{ user.id ? 'Update' : 'Create' } User</Submit>
				</Grid.Col>
			</Grid.Col>
		</Form>
	)
}

export default UserForm
