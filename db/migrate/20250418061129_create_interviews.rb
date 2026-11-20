class CreateInterviews < ActiveRecord::Migration[7.2]
  def change
    create_table :interviews, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.datetime :scheduled_at
      t.string :location
      t.string :interview_type
      t.text :notes

      t.timestamps
    end
  end
end
