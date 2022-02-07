import React, { useEffect } from 'react'
import { Head } from '@inertiajs/inertia-react'

import { Form, useForm, Input, Autocomplete } from '@/components/Form'

const Home = (props) => {
	const data = {
		first_name: '',
		last_name: '',
		employee: null,
	}

	const handleSubmit = ({ data, transform, post }) => {
		console.log({ data })
	}

	return (
		<>
			<Head title="Home"></Head>
			<div>
				<h1>Hello { props.name }</h1>
			</div>

			<Form data={ data } onSubmit={ handleSubmit }>
				<Input label="First Name" name="first_name" />
				<Autocomplete label="Data" name="employee" options={ [
					{ id: 4, label: 'Walden' },
					{ id: 2, label: 'McCroskey' },
				] } />
				<button>Submit</button>
			</Form>
		</>
	)
}

export default Home
