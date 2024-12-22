class CreateDosages < ActiveRecord::Migration[7.1]
  def change
    create_table :dosages, id: :uuid do |t|
      t.decimal :amount
      t.integer :amount_unit
      t.decimal :freq_amount
      t.integer :freq_period
      t.text :notes

      t.timestamps
    end
  end
end
