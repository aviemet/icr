class CreateComplianceForms < ActiveRecord::Migration[8.0]
  def change
    create_table :compliance_form_templates, id: :uuid do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.integer :form_version, null: false, default: 1
      t.integer :cadence, null: false, default: 0
      t.integer :subject_type, null: false, default: 0
      t.boolean :active, null: false, default: true
      t.boolean :system, null: false, default: false

      t.timestamps
    end

    add_index :compliance_form_templates, :slug, unique: true
    add_index :compliance_form_templates, :active

    create_table :compliance_form_sections, id: :uuid do |t|
      t.references :form_template, type: :uuid, null: false, foreign_key: { to_table: :compliance_form_templates }
      t.string :name, null: false
      t.string :key, null: false
      t.integer :position, null: false, default: 0
      t.string :show_when

      t.timestamps
    end

    add_index :compliance_form_sections, [:form_template_id, :key], unique: true
    add_index :compliance_form_sections, [:form_template_id, :position]

    create_table :compliance_form_items, id: :uuid do |t|
      t.references :form_section, type: :uuid, null: false, foreign_key: { to_table: :compliance_form_sections }
      t.string :key, null: false
      t.string :label, null: false
      t.integer :kind, null: false, default: 0
      t.integer :position, null: false, default: 0
      t.boolean :required, null: false, default: true
      t.string :show_when

      t.timestamps
    end

    add_index :compliance_form_items, [:form_section_id, :key], unique: true
    add_index :compliance_form_items, [:form_section_id, :position]

    create_table :compliance_form_submissions, id: :uuid do |t|
      t.references :form_template, type: :uuid, null: false, foreign_key: { to_table: :compliance_form_templates }
      t.references :household, type: :uuid, null: true, foreign_key: true
      t.references :client, type: :uuid, null: true, foreign_key: true
      t.references :conducted_by, type: :uuid, null: true, foreign_key: { to_table: :employees }
      t.date :inspected_on
      t.date :due_on
      t.integer :status, null: false, default: 0
      t.integer :started_via, null: false, default: 0
      t.integer :template_version, null: false, default: 1
      t.datetime :submitted_at
      t.datetime :closed_at

      t.timestamps
    end

    add_index :compliance_form_submissions, :status
    add_index :compliance_form_submissions, :due_on
    add_index :compliance_form_submissions, [:form_template_id, :household_id, :status]
    add_index :compliance_form_submissions, [:form_template_id, :client_id, :status]

    create_table :compliance_form_answers, id: :uuid do |t|
      t.references :form_submission, type: :uuid, null: false, foreign_key: { to_table: :compliance_form_submissions }
      t.references :form_item, type: :uuid, null: false, foreign_key: { to_table: :compliance_form_items }
      t.integer :check_value
      t.text :text_value
      t.date :date_value

      t.timestamps
    end

    add_index :compliance_form_answers, [:form_submission_id, :form_item_id], unique: true, name: "index_compliance_form_answers_on_submission_and_item"

    create_table :compliance_corrective_actions, id: :uuid do |t|
      t.references :form_submission, type: :uuid, null: false, foreign_key: { to_table: :compliance_form_submissions }
      t.references :incident_report, type: :uuid, null: true, foreign_key: true
      t.text :description, null: false
      t.text :root_cause
      t.text :remedy
      t.date :due_on
      t.datetime :closed_at

      t.timestamps
    end

    add_index :compliance_corrective_actions, :closed_at
  end
end
