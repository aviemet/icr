class CreateEmployees < ActiveRecord::Migration[8.0]
  def change
    create_table :employees, id: :uuid do |t|
      t.belongs_to :person, type: :uuid, null: false, foreign_key: true
      t.date :active_at
      t.datetime :inactive_at
      t.string :number
      t.string :color
      t.integer :status
      t.boolean :eligible_for_hire, default: true, null: false
      t.text :ineligibility_reason
      t.text :termination_reason
      t.string :preferred_language
      t.text :communication_notes
      t.string :application_source
      t.integer :desired_compensation_cents
      t.string :desired_compensation_currency, default: "USD", null: false
      t.integer :desired_compensation_period
      t.text :hiring_notes
      t.references :desired_job_title, type: :uuid, foreign_key: { to_table: :job_titles }

      t.string :slug, null: false, index: { unique: true }
      t.string :overtime_policy, null: false, default: "standard"

      t.timestamps
    end
  end
end
