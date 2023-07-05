class CreateClientsShifts < ActiveRecord::Migration[7.0]
  def change
    create_table :clients_shifts do |t|
      t.belongs_to :client
      t.belongs_to :shift

      t.timestamps
    end
  end
end
