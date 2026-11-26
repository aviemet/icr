class CreateTimeOffTables < ActiveRecord::Migration[8.0]
  def change
    create_table :time_off_requests, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.integer :kind, null: false
      t.datetime :starts_at, null: false
      t.datetime :ends_at, null: false
      t.decimal :hours, precision: 8, scale: 2, null: false
      t.integer :status, null: false, default: 0
      t.datetime :reviewed_at
      t.text :review_note
      t.references :shift, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :time_off_requests, :status
    add_index :time_off_requests, [:employee_id, :status]
  end
end
