require "rails_helper"

# == Schema Information
#
# Table name: employees
#
#  id                            :uuid             not null, primary key
#  active_at                     :date
#  application_source            :string
#  color                         :string
#  communication_notes           :text
#  desired_compensation_cents    :integer
#  desired_compensation_currency :string           default("USD"), not null
#  desired_compensation_period   :integer
#  eligible_for_hire             :boolean          default(TRUE), not null
#  hiring_notes                  :text
#  inactive_at                   :datetime
#  ineligibility_reason          :text
#  number                        :string
#  overtime_policy               :string           default("standard"), not null
#  preferred_language            :string
#  slug                          :string           not null
#  status                        :integer
#  termination_reason            :text
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  desired_job_title_id          :uuid
#  person_id                     :uuid             not null
#
# Indexes
#
#  index_employees_on_desired_job_title_id  (desired_job_title_id)
#  index_employees_on_person_id             (person_id)
#  index_employees_on_slug                  (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (desired_job_title_id => job_titles.id)
#  fk_rails_...  (person_id => people.id)
#
RSpec.describe EmployeeSerializer do
  it "serializes attached resume and cover letter as Attachments::FileSerializer payloads" do
    employee = create(:employee)
    file = fixture_file_upload(Rails.root.join("spec/fixtures/files/sample.pdf"), "application/pdf")
    employee.resume.attach(file)
    employee.cover_letter.attach(file)

    payload = described_class.render(employee)

    expect(payload[:resume]).to include(
      id: employee.resume.id,
      filename: "sample.pdf",
      content_type: "application/pdf",
    )
    expect(payload[:cover_letter]).to include(
      id: employee.cover_letter.id,
      filename: "sample.pdf",
      content_type: "application/pdf",
    )
  end

  it "omits resume and cover letter when unattached" do
    employee = create(:employee)

    payload = described_class.render(employee)

    expect(payload[:resume]).to be_nil
    expect(payload[:cover_letter]).to be_nil
  end

  it "serializes desired_compensation as Money" do
    employee = create(:employee, desired_compensation: Money.new(2200, "USD"))

    payload = described_class.render(employee)

    expect(payload[:desired_compensation]).to eq(
      amount: 22.0,
      cents: 2200,
      currency_iso: "USD",
    )
  end
end
