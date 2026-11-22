class CreateReportDefinitionsAndRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :report_definitions, id: :uuid do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :resource_key, null: false
      t.string :mode, null: false, default: "list"
      t.string :format, null: false, default: "xlsx"
      t.jsonb :columns, null: false, default: []
      t.jsonb :default_filters, null: false, default: {}
      t.jsonb :grouper_keys, null: false, default: []
      t.jsonb :aggregator_keys, null: false, default: []
      t.boolean :system, null: false, default: false
      t.references :created_by, type: :uuid, foreign_key: { to_table: :users }, null: true

      t.timestamps
    end

    add_index :report_definitions, :slug, unique: true
    add_index :report_definitions, :resource_key
    add_index :report_definitions, :system

    create_table :report_requests, id: :uuid do |t|
      t.references :report_definition, type: :uuid, null: false, foreign_key: true
      t.string :status, null: false, default: "pending"
      t.jsonb :params, null: false, default: {}
      t.jsonb :definition_snapshot, null: false, default: {}
      t.references :requested_by, type: :uuid, foreign_key: { to_table: :users }, null: false
      t.text :error_message
      t.datetime :completed_at

      t.timestamps
    end

    add_index :report_requests, :status
    add_index :report_requests, :completed_at
  end
end
