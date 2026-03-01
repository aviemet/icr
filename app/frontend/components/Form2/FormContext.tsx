import createContext from "@/lib/hooks/createContext"

const [useFormContext, FormContextProvider] = createContext<string>()

function useFormInputName(name?: string): string | undefined {
	const modelPath = useFormContext(false)

	if(!modelPath || !name) {
		return name
	}

	if(name.charAt(0) === "[") {
		return `${modelPath}${name}`
	}

	return `${modelPath}.${name}`
}

export { useFormContext, FormContextProvider, useFormInputName }
