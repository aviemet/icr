module PolicyStubUsers
  def stub_admin_user
    instance_double(User, id: nil, has_role?: true, person: nil)
  end

  def stub_employee_user(job_title: nil, job_title_roles: [], employee: nil, person: nil)
    job_title ||= stub_job_title(roles: job_title_roles)
    employee ||= instance_double(Employee, job_title: job_title)
    person ||= instance_double(
      Person,
      agency_role: "Employee",
      client: nil,
      employee: employee,
      employee?: true,
    )

    instance_double(User, has_role?: false, person: person)
  end

  def stub_client_user(client: nil, person: nil)
    client ||= instance_double(Client)
    person ||= instance_double(
      Person,
      agency_role: "Client",
      client: client,
      employee: nil,
      employee?: false,
    )

    instance_double(User, has_role?: false, person: person)
  end

  def stub_job_title(roles: [])
    job_title = instance_double(Employee::JobTitle)
    allow(job_title).to receive(:has_role?) do |action, resource_class|
      roles.include?([action, resource_class])
    end
    job_title
  end
end

RSpec.configure do |config|
  config.include PolicyStubUsers, type: :policy
end
