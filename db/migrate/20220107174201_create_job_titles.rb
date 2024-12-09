class CreateJobTitles < ActiveRecord::Migration[7.1]
  def change
    create_table :job_titles, id: :uuid do |t|
      t.string :title, null: false
      t.text :description

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
