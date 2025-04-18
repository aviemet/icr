class CreateEmployeeEmploymentStatuses < ActiveRecord::Migration[7.2]
  def change
    create_table :employment_statuses, id: :uuid do |t|
      t.string :name
      t.datetime :active_at
      t.datetime :inactive_at
      t.text :notes
      t.integer :order
      t.references :employee, null: false, type: :uuid, foreign_key: true
      t.references :updated_by, null: false, type: :uuid, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
