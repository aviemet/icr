class CreatePgSearchDocuments < ActiveRecord::Migration[7.1]
  def up
    execute "create extension pg_trgm;"
    enable_extension "unaccent"

    say_with_time("Creating table for pg_search multisearch") do
      create_table :pg_search_documents, id: :uuid do |t|
        t.text :content
        t.text :label
        t.belongs_to :searchable, type: :uuid, polymorphic: true, index: true
        t.timestamps null: false
      end
    end
  end

  def down
    say_with_time("Dropping table for pg_search multisearch") do
      drop_table :pg_search_documents
    end
  end
end
