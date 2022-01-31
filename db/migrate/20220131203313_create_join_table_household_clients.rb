class CreateJoinTableHouseholdClients < ActiveRecord::Migration[7.0]
  def change
		create_join_table :households, :people do |t|
			t.index :household_id
			t.index :person_id
		end
  end
end
