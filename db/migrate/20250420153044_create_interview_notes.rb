class CreateInterviewNotes < ActiveRecord::Migration[7.2]
  def change
    create_table :interview_notes, id: :uuid do |t|
      t.text :note
      t.integer :recommendation
      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid
      t.belongs_to :interview, null: false, type: :uuid, foreign_key: { to_table: :employees }

      t.timestamps
    end
  end
end
