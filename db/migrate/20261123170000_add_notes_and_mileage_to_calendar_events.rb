class AddNotesAndMileageToCalendarEvents < ActiveRecord::Migration[8.1]
  def change
    change_table :calendar_events, bulk: true do |t|
      t.text :notes
      t.decimal :mileage, precision: 8, scale: 2
    end
  end
end
