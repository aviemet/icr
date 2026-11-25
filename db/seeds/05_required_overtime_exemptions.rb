overnight = ServiceType.find_by!(name: "Overnight")

OvertimeExemption.find_or_create_by!(name: "Overnight") do |record|
  record.active = true
  record.criteria = [
    { "category" => { "operator" => "equals", "value" => overnight.slug } },
  ]
end

Rails.logger.info "[seeds] overtime exemptions"
