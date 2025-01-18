# rubocop:disable Style/SoleNestedConditional
if Rails.env.development?
  if Shift.count == 0
    5.times do |i|
      employee = FactoryBot.create(:employee, { job_title: JobTitle.find_by(slug: "attendant") })
      FactoryBot.create(:address, contact: employee.contact, category: Category.type(:address).sample)
      FactoryBot.create(:email, contact: employee.contact, category: Category.type(:email).sample)
      FactoryBot.create(:phone, contact: employee.contact, category: Category.type(:phone).sample)

      client = Client.first
      start = Time.current.beginning_of_week + (i * 4).hours

      60.times do |w|
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
# rubocop:enable Style/SoleNestedConditional
