import React from 'react'

const PagesDir = 'Pages'

/**
 * Explicit import paths for rollup dyanimc import plugin
 * This limits directory nesting for page entry points to 3 levels
 * Any single level imports, such as 'Home', must be a drectory with an index.tsx file
 * First level files will cause an error
 *
 * @param name Path to directory containing an index.tsx file: "Clients/Show"
 * @returns Promise
 */
const dynamicImport = async (name: string): Promise<React.ReactNode|void> => {
	const path = name.split('/')
	switch (path.length) {
		case 1:
			return (await import(`./${PagesDir}/${name}/index.tsx`)).default
		case 2:
			return (await import(`./${PagesDir}/${path[0]}/${path[1]}/index.tsx`)).default
		case 3:
			return (await import(`./${PagesDir}/${path[0]}/${path[1]}/${path[2]}/index.tsx`)).default
		default:
			console.error(`Provided path ${path} is not supported. Must be between 1 and 3 levels deep only`)
	}
}

export default dynamicImport
