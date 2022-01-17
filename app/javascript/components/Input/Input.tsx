import React from 'react'
import { colorClass, Tcolors } from 'layouts/theme'
import { InputProps as IProps } from 'react-html-props'
import classnames from 'classnames'

interface InputProps extends IProps {
	color: Tcolors
	size: string
	outline: boolean
	error: string
	success: string
}

const Input = ({
	placeholder,
	color = 'lightBlue',
	size = 'regular',
	outline = false,
	error,
	success,
	...rest
}: InputProps) => {
	let labelBorderColor,
					mtInputBorderColor,
					mtInputOutlineColor,
					mtInputOutlineFocusColor,
					inputClasses = []

	let container = ['w-full', 'relative']

	const mtInputColors = colorClass('mt-input', color, { default: 500, yellow: 600 })
	const mtInputOutlineColors = colorClass('mt-input-outline', color, { default: 500, yellow: 600 })
	const borderColors = colorClass('border', color, { default: 500, yellow: 600 })

	if (error) {
		labelBorderColor = borderColors['red']
		mtInputBorderColor = mtInputColors['red']
		mtInputOutlineColor = mtInputOutlineColors['red']
		mtInputOutlineFocusColor = borderColors['red']
	} else if (success) {
		labelBorderColor = borderColors['green']
		mtInputBorderColor = mtInputColors['green']
		mtInputOutlineColor = mtInputOutlineColors['green']
		mtInputOutlineFocusColor = borderColors['green']
	} else {
		labelBorderColor = 'border-gray-300'
		mtInputBorderColor = mtInputColors[color]
		mtInputOutlineColor = mtInputOutlineColors[color]
		mtInputOutlineFocusColor = borderColors[color]
	}

	let label = [
		'text-gray-400',
		'absolute',
		'left-0',
		`${outline ? '-top-1.5' : '-top-0.5'}`,
		'w-full',
		'h-full',
		`${!outline && 'border border-t-0 border-l-0 border-r-0 border-b-1'}`,
		labelBorderColor,
		'pointer-events-none',
		`${outline && 'flex'}`,
		`${outline && size === 'sm' && 'text-sm'}`,
		`${outline && 'leading-10'}`,
		`${outline && 'transition-all'}`,
		`${outline && 'duration-300'}`,
	]

	const sharedClasses = [
		'w-full',
		'h-full',
		'text-gray-800',
		'leading-normal',
		'shadow-none',
		'outline-none',
		'focus:outline-none',
		'focus:ring-0',
		'focus:text-gray-800',
	]

	const inputSM = [
		...sharedClasses,
		`${outline ? 'px-3' : 'px-0'}`,
		`${outline && 'pt-1.5 pb-0.5'}`,
		'text-sm',
	]
	const inputRegular = [
		...sharedClasses,
		`${outline ? 'px-3' : 'px-0'}`,
		`${outline && 'pt-2.5 pb-1.5'}`,
	]
	const inputLG = [
		...sharedClasses,
		`${outline ? 'px-3' : 'px-0'}`,
		`${outline && 'pt-3.5 pb-2.5'}`,
	]

	const inputFilled = [
		mtInputBorderColor,
		'mt-input',
		'bg-transparent',
		'border-none',
	]

	const inputOutline = [
		mtInputOutlineColor,
		labelBorderColor,
		'mt-input-outline',
		'bg-transparent',
		'border',
		'border-1',
		'border-gray-300',
		'rounded-lg',
		'focus:border-2',
		`focus:${mtInputOutlineFocusColor}`,
	]

	if (size === 'sm') {
		container.push('h-9')
		inputClasses.push(...inputSM)
	} else if (size === 'lg') {
		container.push('h-12')
		inputClasses.push(...inputLG)
	} else {
		container.push('h-11')
		inputClasses.push(...inputRegular)
	}

	outline
		? inputClasses.push(...inputOutline)
		: inputClasses.push(...inputFilled)

	container = container.join(' ')
	label = label.join(' ')
	inputClasses = inputClasses.join(' ')

	return (
		<div className={ container }>
			<input
				{ ...rest }
				placeholder=" "
				className={ `${inputClasses} ${
					error && 'mt-input-outline-error'
				} ${success && 'mt-input-outline-success'}` }
			/>
			<label className={ label }>
				{ outline ? (
					placeholder
				) : (
					<span
						className={ `${
							size === 'sm' && 'text-sm'
						} absolute top-1/4 transition-all duration-300` }
					>
						{ placeholder }
					</span>
				) }
			</label>
			{ error && (
				<span className="block mt-1 text-xs text-red-500">{ error }</span>
			) }
			{ success && (
				<span className="block mt-1 text-xs text-green-500">
					{ success }
				</span>
			) }
		</div>
	)
}

export default Input

Input.defaultProps = {
	color: 'lightBlue',
	size: 'regular',
	outline: false,
}

Input.propTypes = {
	placeholder: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	size: PropTypes.string.isRequired,
	outline: PropTypes.bool.isRequired,
	error: PropTypes.string,
	success: PropTypes.string,
}
