class CreateClientsShifts < ActiveRecord::Migration[7.0]
  def change
    create_table :clients_shifts do |t|
      t.references :shift, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true

      t.timestamps
    end
  end
end
