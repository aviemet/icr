class CreatePayRates < ActiveRecord::Migration[7.1]
  def change
    create_table :pay_rates, id: :uuid do |t|
      t.monetize :rate
      t.integer :period, null: false
      t.text :notes
      t.datetime :starts_at
      t.datetime :ends_at

      t.belongs_to :employee, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
