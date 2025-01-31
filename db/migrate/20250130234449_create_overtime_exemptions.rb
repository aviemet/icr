class CreateOvertimeExemptions < ActiveRecord::Migration[7.2]
  def change
    create_table :overtime_exemptions, id: :uuid do |t|
      t.string :name, null: false
      t.boolean :active, null: false, default: true

      # Array of criterion groups that are OR'ed together
      # Each group is a hash of criteria that are AND'ed together
      # Example structure:
      # criteria: [
      #   { # Group 1 (all these must be true)
      #     category: { operator: "equals", value: "sleep_shift" },
      #     start_time: { operator: "between", value: ["22:00", "23:59"] },
      #     duration: { operator: "greater_than_equal", value: 8 }
      #   },
      #   { # Group 2 (if any group is true, shift is exempt)
      #     category: { operator: "equals", value: "standby" },
      #     duration: { operator: "greater_than_equal", value: 12 }
      #   }
      # ]
      t.jsonb :criteria, null: false, default: []

      t.timestamps
    end
  end
end
