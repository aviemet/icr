class CreateRequirementTypes < ActiveRecord::Migration[7.2]
  def change
    create_table :requirement_types, id: :uuid do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
