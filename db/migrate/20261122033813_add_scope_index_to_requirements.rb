class AddScopeIndexToRequirements < ActiveRecord::Migration[8.0]
  def change
    add_index :requirements, [:scope_type, :scope_id], name: "index_requirements_on_scope"
  end
end
