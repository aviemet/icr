class CreatePeople < ActiveRecord::Migration[7.0]
  def change
    create_table :people do |t|
      t.string :f_name
      t.string :m_name
      t.string :l_name
      t.string :slug, null: false, index: { unique: true }
      t.integer :person_type, null: true
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end
  end
end
