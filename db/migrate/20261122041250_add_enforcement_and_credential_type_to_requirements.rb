class AddEnforcementAndCredentialTypeToRequirements < ActiveRecord::Migration[8.0]
  def change
    add_column :requirements, :enforcement, :integer, null: false, default: 0
    add_index :requirements, :enforcement

    change_table :requirement_items, bulk: true do |t|
      t.change_null :fulfillable_type, true
      t.change_null :fulfillable_id, true
      t.integer :credential_type
    end

    remove_index :requirement_items,
                 column: [:requirement_id, :fulfillable_type, :fulfillable_id],
                 unique: true,
                 name: "index_req_items_on_req_fulfillable_unique"
    add_index :requirement_items,
              [:requirement_id, :fulfillable_type, :fulfillable_id],
              unique: true,
              where: "fulfillable_id IS NOT NULL",
              name: "index_req_items_on_req_fulfillable_unique"
    add_index :requirement_items,
              [:requirement_id, :credential_type],
              unique: true,
              where: "credential_type IS NOT NULL",
              name: "index_req_items_on_req_credential_type_unique"
  end
end
