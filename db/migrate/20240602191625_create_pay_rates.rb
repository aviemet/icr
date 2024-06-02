class CreatePayRates < ActiveRecord::Migration[7.1]
  def change
    create_table :pay_rates do |t|
      t.string :title
      t.monetize :rate
      t.integer :period, null: false
      t.text :notes

      t.timestamps
    end
  end
end
