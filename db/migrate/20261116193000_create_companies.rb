class CreateCompanies < ActiveRecord::Migration[8.1]
  def change
    create_table :companies, id: :uuid do |t|
      t.string :name, null: false
      t.belongs_to :regional_center, type: :uuid, null: true, foreign_key: true

      t.timestamps
    end
  end
end
