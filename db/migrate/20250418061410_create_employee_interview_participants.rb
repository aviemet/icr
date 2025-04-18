class CreateEmployeeInterviewParticipants < ActiveRecord::Migration[7.2]
  def change
    create_table :interview_participants, id: :uuid do |t|
      t.references :person, null: false, type: :uuid, foreign_key: true
      t.references :interview, null: false, type: :uuid, foreign_key: true
      t.text :notes

      t.timestamps
    end
  end
end
