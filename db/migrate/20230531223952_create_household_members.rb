class CreateHouseholdMembers < ActiveRecord::Migration[7.0]
  def change
    create_table :household_members do |t|
      t.references :household, null: false, foreign_key: true
      t.references :client, null: true, foreign_key: true
      t.references :employee, null: true, foreign_key: true

      t.timestamps
    end
  end
end
