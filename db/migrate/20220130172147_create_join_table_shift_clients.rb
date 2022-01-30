class CreateJoinTableShiftClients < ActiveRecord::Migration[7.0]
  def change
		# TODO: Can people be aliased as "clients" on a habtm join table?
		create_join_table :shifts, :people do |t|
			t.index :shift_id
			t.index :person_id
		end
  end
end
