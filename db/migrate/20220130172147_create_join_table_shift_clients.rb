class CreateJoinTableShiftClients < ActiveRecord::Migration[7.0]
  def change
		create_join_table :shifts, :people do |t|
			t.index :shift_id
			t.index :person_id
		end
  end
end
