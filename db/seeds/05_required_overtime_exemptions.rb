overnight_category = Category.find_or_create_by!(name: "Overnight", categorizable_type: "Shift") do |record|
  record.system = false
end

OvertimeExemption.find_or_create_by!(name: "Overnight") do |record|
  record.active = true
  record.criteria = [
    { "category" => { "operator" => "equals", "value" => overnight_category.slug } },
  ]
end

Rails.logger.info "[seeds] overtime exemptions"
