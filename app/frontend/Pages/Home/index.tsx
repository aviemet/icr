import React, { useEffect } from 'react'
import { Head } from '@inertiajs/inertia-react'

import { Form, useForm, Input, Autocomplete, NumberInput } from '@/Components/Form'

const Home = (props) => {
	const data = {
		first_name: '',
		last_name: '',
		employee: null,
		count: -1
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
				<NumberInput name="count" min={ 5 } max={ 20 } />
				<button>Submit</button>
			</Form>
		</>
	)
}

export default Home
