class CreateIdentifications < ActiveRecord::Migration[7.1]
  def change
    create_table :identifications, id: :uuid do |t|
      t.belongs_to :identificationable, type: :uuid, polymorphic: true, null: false
      t.integer :type
      t.integer :number
      t.text :notes
      t.date :issued_at
      t.date :expires_at
      t.jsonb :extra_fields

      t.timestamps
    end
  end
end
