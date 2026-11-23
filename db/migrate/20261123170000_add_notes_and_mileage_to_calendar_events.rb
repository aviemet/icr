class AddNotesAndMileageToCalendarEvents < ActiveRecord::Migration[8.1]
  def change
    add_column :calendar_events, :notes, :text
    add_column :calendar_events, :mileage, :decimal, precision: 8, scale: 2
  end
end
