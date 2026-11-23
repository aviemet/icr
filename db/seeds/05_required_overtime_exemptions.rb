overnight = ServiceType.find_or_initialize_by(name: "Overnight")
overnight.assign_attributes(
  system: false,
  active: true,
  billable: true,
  payable: true,
  allows_multi_client: false,
  requires_notes: false,
  tracks_mileage: false,
  color: "#15803D",
  position: ServiceType.maximum(:position).to_i + 1,
)
overnight.save!

OvertimeExemption.find_or_create_by!(name: "Overnight") do |record|
  record.active = true
  record.criteria = [
    { "category" => { "operator" => "equals", "value" => overnight.slug } },
  ]
end

Rails.logger.info "[seeds] overtime exemptions"
