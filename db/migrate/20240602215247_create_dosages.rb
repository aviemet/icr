class CreateDosages < ActiveRecord::Migration[7.1]
  def change
    create_table :dosages do |t|
      t.decimal :amount
      t.integer :amount_unit
      t.decimal :freq_amount
      t.integer :freq_period
      t.text :notes

      t.timestamps
    end
  end
end
