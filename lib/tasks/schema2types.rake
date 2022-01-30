namespace :db do
	def typeschema
		sh('schema2type -o app/frontend/types/schema.d.ts --snake')
	end

	desc "Outputs d.ts file of db schema"
	task :typeschema do
		typeschema
	end

  task :migrate do
    typeschema
  end

	task :rollback do
		typeschema
	end
end