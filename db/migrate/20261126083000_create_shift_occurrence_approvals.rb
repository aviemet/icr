# frozen_string_literal: true

class CreateShiftOccurrenceApprovals < ActiveRecord::Migration[8.0]
  def up
    create_table :shift_occurrence_approvals, id: :uuid do |t|
      t.references :shift, null: false, foreign_key: true, type: :uuid
      t.datetime :occurrence_starts_at, null: false
      t.datetime :facilitator_approved_at, null: false
      t.timestamps
    end

    add_index :shift_occurrence_approvals,
      [:shift_id, :occurrence_starts_at],
      unique: true,
      name: "index_shift_occurrence_approvals_uniqueness"

    say_with_time "migrate non-recurring facilitator stamps" do
      execute <<~SQL.squish
        INSERT INTO shift_occurrence_approvals (
          id,
          shift_id,
          occurrence_starts_at,
          facilitator_approved_at,
          created_at,
          updated_at
        )
        SELECT
          gen_random_uuid(),
          shifts.id,
          calendar_events.starts_at,
          shifts.facilitator_approved_at::timestamp,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        FROM shifts
        INNER JOIN calendar_events ON calendar_events.id = shifts.calendar_event_id
        LEFT OUTER JOIN calendar_recurring_patterns
          ON calendar_recurring_patterns.calendar_event_id = calendar_events.id
        WHERE shifts.facilitator_approved_at IS NOT NULL
          AND calendar_recurring_patterns.id IS NULL
      SQL
    end

    say_with_time "clear master facilitator stamps" do
      execute <<~SQL.squish
        UPDATE shifts
        SET facilitator_approved_at = NULL
        WHERE facilitator_approved_at IS NOT NULL
      SQL
    end
  end

  def down
    drop_table :shift_occurrence_approvals
  end
end
