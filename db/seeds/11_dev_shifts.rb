# rubocop:disable Style/SoleNestedConditional
if Rails.env.development?
  if Shift.count == 0
    attendant_job = JobTitle.find_by(slug: "attendant")

    ActiveRecord::Base.transaction do
      5.times do |i|
        employee = FactoryBot.create(:employee)
        employee.assign_job_title(attendant_job)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type(:address).sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type(:email).sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type(:phone).sample)

        client = Client.first
        start = Time.current.beginning_of_week + (i * 4).hours

        120.times do |w|
          next unless w % 7 < 6

          shift = FactoryBot.create(:shift, {
            employee:,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at: start,
              ends_at: start + 4.hours,
            },)
          },)

          client.calendar_events << shift.calendar_event

          start += 1.day
        end
      end
    end
  end
end
# rubocop:enable Style/SoleNestedConditional
