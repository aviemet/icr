incident_report_types = {
  "Injuries Beyond First Aid" => [
    "Medication Reactions",
    "Bites Break Skin",
    "Internal Bleeding",
    "Puncture Wounds",
  ],
  "Serious Injury/Accident" => [
    "Fractures",
    "Injury Accident - Dislocation",
    "Lacerations requiring sutures/staples",
    "Medication Error",
  ],
  "Unauthorized Absence" => [
    "Missing Person- law notified"
  ],
  "Hospitalizations" => [
    "Involuntary Psych Admission",
    "Nutrition Deficiency",
    "Cardiac Care",
    "Diabetes",
    "Internal Infection",
    "Seizures",
    "Respiratory Illness",
    "Wound/Skin Care",
    "Other",
  ],
  "Death" => ["Death"],
  "Victim of a Crime" => [
    "Aggravated Assault",
    "Burglary",
    "Personal Robbery",
    "Larceny",
    "Rape/Attempted Rape",
  ],
  "Suspected Abuse/Exploitation" => [
    "Physical",
    "Sexual",
    "Fiduciary",
    "Emotional / Mental",
    "Physical and/or Chemical Restraint",
  ],
  "Suspected Neglect" => [
    "Failure to Provide medical care for physical and mental health needs",
    "Failure to Prevent malnutrition or dehydration",
    "Failure to Protect from health and safety hazards",
    "Failure to Assist in personal hygiene",
    "Failure to Provide food, clothing, shelter",
    "Failure to Provide care - Elder/Adult",
  ],
  "COVID-19" => ["COVID-19"],
  "Other" => [
    "Choking Incidents",
    "Transportation Incidents",
    "Disease Outbreaks",
    "Physical Restraints",
    "Arrest",
    "Suicide Threat/Attempt",
    "Fire Setting",
    "Other Sexual Incident-client is the aggressor",
    "Media Attention",
    "Not Listed",
  ]
}

if Category.count == 0
  {
    "Contact::Email": ["Work", "Personal", "Other"],
    "Contact::Address": ["Work", "Personal", "Other"],
    "Contact::Phone": ["Home", "Mobile", "Office", "Other"],
    "Contact::Website": ["Personal", "Business", "Vendor", "Other"],
    Vendor: [
      "Day Program",
      "Medical Supply",
      "Mental Health",
      "Residential Services",
      "Long Term Care Facility",
      "Crisis Services",
      "Other",
    ],
    IncidentReport: incident_report_types.keys,
    Identification: [
      "Drivers License",
      "Passport",
      "State ID",
      "Birth Certificate",
      "Social Security Card",
      "Other",
    ],
    Shift: [
      "Regular",
      "On-Call",
      "No Service",
      "Holiday",
      "Vacation",
      "Sick",
      "Other",
    ],
    "Calendar::Event": [
      "Shift",
      "Day Program",
      "Private Time",
      "Other",
    ],
  }.each do |type, categories|
    categories.each do |category|
      Category.create!({
        name: category,
        categorizable_type: type,
      })
    end
  end

  incident_report_types.each do |category, subcategories|
    parent = Category.find_by(categorizable_type: "IncidentReport", name: category)
    subcategories.each do |subcategory|
      Category.create({
        parent:,
        categorizable_type: parent.categorizable_type,
        name: subcategory
      })
    end
  end
end
