class CreateDosages < ActiveRecord::Migration[8.0]
  def change
    create_table :dosages, id: :uuid do |t|
      t.decimal :amount
      t.integer :amount_unit
      t.decimal :freq_amount
      t.integer :freq_period
      t.integer :administration_method
      t.text :notes

      t.timestamps
    end
  end
end
