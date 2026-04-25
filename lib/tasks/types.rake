namespace :types do
  desc "Annotate models and fixtures with database schema"
  task generate: :environment do
    Rake::Task["types_from_serializers:generate"].invoke
    Rake::Task["types:generate_category_type"].invoke
    Rake::Task["types:generate_system_categories"].invoke
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

  desc "Export system categories (system: true) to app/frontend/lib/system_categories.generated.ts"
  task generate_system_categories: :environment do
    slugs_by_type = Category.where(system: true).pluck(:categorizable_type, :name, :slug)
      .each_with_object(Hash.new { |h, k| h[k] = {} }) { |(ct, name, slug), h| h[ct][name] = slug }
    path = Rails.root.join("app/frontend/types/system_categories.generated.ts")
    slugs_json = slugs_by_type.to_json
    content = "export const SYSTEM_CATEGORY_SLUGS = #{slugs_json} as const\n\n" \
              "export type SystemCategoryType = keyof typeof SYSTEM_CATEGORY_SLUGS\n\n" \
              "export type SystemCategoryName<T extends SystemCategoryType> = keyof (typeof SYSTEM_CATEGORY_SLUGS)[T]\n\n" \
              "export type SystemCategorySlug<T extends SystemCategoryType, N extends SystemCategoryName<T>> = (typeof SYSTEM_CATEGORY_SLUGS)[T][N]\n\n" \
              "export type SystemCategorySlugsFor<T extends SystemCategoryType> = Extract<(typeof SYSTEM_CATEGORY_SLUGS)[T][SystemCategoryName<T>], string>\n"
    File.write(path, content)
  end
end
