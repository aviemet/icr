namespace :types do
  desc "Annotate models and fixtures with database schema"
  task generate: :environment do
    Rake::Task["types_from_serializers:generate"].invoke
    Rake::Task["types:generate_category_type"].invoke
    Rake::Task["annotate:models"].invoke
    system("rails restart")
  end

  desc "Export Category::CATEGORIZABLE_TYPES to app/frontend/types/CategoryType.ts"
  task generate_category_type: :environment do
    types = Category::CATEGORIZABLE_TYPES
    union = types.map { |t| "\"#{t}\"" }.join(" | ")
    path = Rails.root.join("app/frontend/types/CategoryType.ts")
    File.write(path, "export type CategoryType = #{union}\n")
  end
end
