# frozen_string_literal: true

class CreateShiftOccurrenceOverrides < ActiveRecord::Migration[8.0]
  def up
    create_table :shift_occurrence_overrides, id: :uuid do |t|
      t.references :shift, null: false, foreign_key: true, type: :uuid
      t.datetime :occurrence_starts_at, null: false
      t.boolean :ihss, null: true
      t.references :service_type, null: true, foreign_key: true, type: :uuid
      t.timestamps
    end

    add_index :shift_occurrence_overrides,
      [:shift_id, :occurrence_starts_at],
      unique: true,
      name: "index_shift_occurrence_overrides_uniqueness"

    say_with_time "migrate non-recurring IHSS stamps to occurrence overrides" do
      execute <<~SQL.squish
        INSERT INTO shift_occurrence_overrides (
          id,
          shift_id,
          occurrence_starts_at,
          ihss,
          service_type_id,
          created_at,
          updated_at
        )
        SELECT
          gen_random_uuid(),
          shifts.id,
          calendar_events.starts_at,
          TRUE,
          NULL,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        FROM shifts
        INNER JOIN calendar_events ON calendar_events.id = shifts.calendar_event_id
        LEFT OUTER JOIN calendar_recurring_patterns
          ON calendar_recurring_patterns.calendar_event_id = calendar_events.id
        WHERE shifts.ihss = TRUE
          AND calendar_recurring_patterns.id IS NULL
      SQL
    end

    say_with_time "clear master IHSS stamps" do
      execute <<~SQL.squish
        UPDATE shifts
        SET ihss = FALSE
        WHERE ihss = TRUE
      SQL
    end
  end

  def down
    drop_table :shift_occurrence_overrides
  end
end
