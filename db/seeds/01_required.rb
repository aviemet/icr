def create_default_categories
  {
    Email: ["Work", "Personal"],
    Address: ["Work", "Personal"],
    Phone: ["Home", "Mobile", "Office"],
    Vendor: [
      "Day Program",
      "Medical Supply",
      "Mental Health",
      "Residential Services",
      "Long Term Care Facility",
      "Crisis Services"
    ],
    IncidentReport: [
      "Injuries Beyond First Aid",
      "Serious Injury/Accident",
      "Unauthorized Absence",
      "Hospitalizations",
      "Death",
      "Victim of a Crime",
      "Suspected Abuse/Exploitation",
      "Suspected Neglect",
      "COVID-19",
    ]
  }.each do |type, categories|

    categories.each do |category|
      Category.create!({
        name: category,
        categorizable_type: type,
      })
    end

    Category.create!({
      name: "Other",
      categorizable_type: type,
    })
  end
end

def create_default_incident_types
  {
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
  }.each do |category, name|
    IncidentType.create({
      category: Category.find_by(name: category),
      name:
    })
  end
end

if Category.count == 0
  create_default_categories
end

if IncidentType.count == 0
  create_default_incident_types
end
