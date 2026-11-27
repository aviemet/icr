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
class EmployeeSerializer < ApplicationSerializer
  include PersonFields
  include ColorMappingFields

  object_as :employee

  identifier :slug

  attributes(
    :number,
    :person_id,
    :active_at,
    :inactive_at,
    :color,
    :status,
    :preferred_language,
    :communication_notes,
    :eligible_for_hire,
    :termination_reason,
    :ineligibility_reason,
    :application_source,
    :desired_compensation_cents,
    :desired_compensation_currency,
    :desired_compensation_period,
    :desired_job_title_id,
    :hiring_notes,
  )

  type :string, optional: true
  def desired_compensation
    @object.desired_compensation&.to_s
  end

  has_one :resume, serializer: Attachments::FileSerializer, optional: true do
    @object.resume if @object.resume.attached?
  end

  has_one :cover_letter, serializer: Attachments::FileSerializer, optional: true do
    @object.cover_letter if @object.cover_letter.attached?
  end

  belongs_to :person, serializer: PersonSerializer
  has_one :job_title, serializer: Employee::JobTitleSerializer
  belongs_to :desired_job_title, serializer: Employee::JobTitleSerializer, optional: true
end
