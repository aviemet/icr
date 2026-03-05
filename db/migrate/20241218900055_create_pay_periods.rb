class CreatePayPeriods < ActiveRecord::Migration[8.1]
  def change
    create_table :pay_periods, id: :uuid do |t|
      t.datetime :starts_at
      t.datetime :ends_at
      t.integer :status
      t.datetime :approved_at
      t.integer :period_type
      t.jsonb :config_snapshot

      t.timestamps
    end

    add_index :pay_periods, [:starts_at, :ends_at], unique: true
  end
end
