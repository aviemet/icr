class CreateClientEnrollments < ActiveRecord::Migration[8.0]
  def change
    create_table :client_enrollments, id: :uuid do |t|
      t.references :client, null: false, foreign_key: true, type: :uuid
      t.references :vendor, null: false, foreign_key: true, type: :uuid
      t.date :starts_on, null: false
      t.date :ends_on
      t.text :notes
      t.timestamps
    end

    add_index :client_enrollments, [:client_id, :vendor_id, :starts_on]
  end
end
