require "rails_helper"

RSpec.describe "Shifts", type: :request do
  describe "POST /schdules" do
    it "Creats a new shift with valid parameters" do
      message = {
        shift: {
          starts_at: "2022-02-10T16:00:00.000Z",
          ends_at: "2022-02-11T00:00:00.000Z",
          client_ids: [
            2,
          ],
          employee_id: 11,
          created_by_id: 1,
        },
        recurring_pattern_attributes: {
          recurring_type: "daily",
          offset: 1,
        },
      }

      expect {
        post shifts_url, params: message
      }.to change { Shift.count }.by(1)
      shift = Shift.last
      expect(shift.recurring_pattern).to exist
    end
  end
end
