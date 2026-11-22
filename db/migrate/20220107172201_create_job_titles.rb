class CreateJobTitles < ActiveRecord::Migration[8.0]
  def change
    create_table :job_titles, id: :uuid do |t|
      t.string :name, null: false
      t.text :description
      t.belongs_to :department, type: :uuid, foreign_key: { to_table: :departments }, null: true

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
