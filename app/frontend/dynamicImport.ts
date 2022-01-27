const dynamicImport = async name => {
	let page
	const path = name.split('/')
	// Explicit import paths for rollup dyanimc import plugin
	// This limits directory nesting for page entry points to 3 levels
	// Any single level imports, such as 'Home', must be a drectory with an index.tsx file
	//   First level files will cause an error
	switch (path.length) {
		case 1:
			page = (await import(`./pages/${name}/index.tsx`)).default
			break
		case 2:
			page = (await import(`./pages/${path[0]}/${path[1]}/index.tsx`)).default
			break
		case 3:
			page = (await import(`./pages/${path[0]}/${path[1]}/${path[2]}/index.tsx`)).default
			break
		default:
			console.error(`Provided path ${path} is not supported. Must be between 1 and 3 levels deep only`)
	}
	return page
}

export default dynamicImport
