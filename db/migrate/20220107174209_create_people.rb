class CreatePeople < ActiveRecord::Migration[7.0]
  def change
    create_table :people do |t|
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.string :slug, null: false, index: { unique: true }
      t.integer :person_type, null: true
      t.references :user, null: true, foreign_key: true
      t.references :job_title, null: true, foreign_key: true

      t.timestamps
    end
  end
end
