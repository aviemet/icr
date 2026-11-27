defaults = [
  { name: "Regular", system: true, billable: true, payable: true, assignable: true, color: "#2F6FED" },
  { name: "On-Call", system: true, billable: true, payable: true, assignable: true, color: "#0B7A75" },
  { name: "Overnight", billable: true, payable: true, assignable: true, color: "#15803D" },
  { name: "Training", billable: false, payable: true, assignable: true, requires_notes: true, color: "#7950F2" },
  { name: "Other", system: true, billable: true, payable: true, assignable: true, color: "#0369A1" },
  { name: "Holiday", system: true, billable: false, payable: true, assignable: false, color: "#7C3AED" },
  { name: "Vacation", system: true, billable: false, payable: true, assignable: false, color: "#B45309" },
  { name: "Sick", system: true, billable: false, payable: true, assignable: false, color: "#BE123C" },
  { name: "Day Program", billable: true, payable: false, assignable: false, color: "#E8590C" },
  { name: "Natural Support", billable: false, payable: false, assignable: false, color: "#12B886" },
  { name: "No Service", system: true, billable: false, payable: false, assignable: false, active: false, color: "#6B7280" },
]

defaults.each_with_index do |attributes, index|
  service_type = ServiceType.find_or_initialize_by(name: attributes[:name])
  service_type.assign_attributes(
    system: attributes.fetch(:system, false),
    active: attributes.fetch(:active, true),
    assignable: attributes.fetch(:assignable, true),
    billable: attributes.fetch(:billable, true),
    payable: attributes.fetch(:payable, true),
    allows_multi_client: attributes.fetch(:allows_multi_client, false),
    requires_notes: attributes.fetch(:requires_notes, false),
    tracks_mileage: attributes.fetch(:tracks_mileage, false),
    color: attributes.fetch(:color, "#2F6FED"),
    position: index,
  )
  service_type.save!
end

Rails.logger.info "[seeds] service types"
