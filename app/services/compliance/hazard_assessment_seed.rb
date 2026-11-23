module Compliance
  class HazardAssessmentSeed
    TEMPLATE_SLUG = "hazard-assessment-correction-record".freeze

    HOME_SAFETY_CHECKS = [
      ["rooms_clean", "All rooms and areas of home are clean enough to meet both the standards of the client/s and basic health and safety standards (i.e. no excessive dirt or rubbish, no vermin infestations, no mold, bed linens are clean, etc.)."],
      ["waste_disposal", "Waste is stored and disposed of in a manner that will not permit the transmission of communicable disease or odors, create a nuisance, or provide a breeding place or food source for insects or rodents."],
      ["food_expiration", "Expiration dates have been checked on both perishable and non-perishable food items; anything spoiled or expired has been safely disposed of."],
      ["bedroom_exit", "Each bedroom has at least one operable window or door that ensures safe, direct, emergency exit to the outside. (If security window bars are used, the window is considered operable only if equipped with safety release devices.)"],
      ["bedroom_storage", "Each bedroom has sufficient storage space to accommodate its occupant's clothing and personal belongings."],
      ["bathroom_fixtures", "Home contains at least 1 toilet, 1 sink, and 1 tub or shower maintained in safe, clean operating condition."],
      ["walkways_clear", "All walkways throughout the home are unobstructed."],
      ["exits_clear", "All exits are clear and unblocked (including emergency exits if applicable)."],
      ["smoke_detector", "Home has indoor sprinkling system or functioning smoke detector installed in the hallway(s) of each sleeping area audible in each bedroom or sleeping room."],
      ["carbon_monoxide", "Carbon monoxide detector/s tested and in working order."],
      ["fire_extinguisher", "There is an unexpired fire extinguisher in the kitchen, and instructions for its use are readily available."],
      ["temperature", "Home is maintained at a safe and comfortable temperature at all times."],
      ["hot_water", "Hot water from all faucets is delivered at a safe temperature."],
      ["appliances_safe", "All appliances are in safe working condition (i.e. gas lines [to stove or dryer for example] are in good working condition; no odor of gas in the home; electric stoves checked on each burner for good working condition; no exposed wires, etc.)."],
      ["no_power_strips", "Major energy-using appliances (such as space heaters) are not plugged into power strips (must be plugged directly into 3-prong wall outlet)."],
      ["lighting", "Lighting in all rooms and other areas is adequate to ensure comfort and safety."],
      ["outlets_covered", "All electric outlets and light switches are covered with plates and in working order, and no outlets are near a water source."],
      ["household_products", "All household products (for cleaning, maintenance, pest control, etc.) are non hazardous (or, if any hazardous products are used, they are properly stored and labeled with clear instructions for safe use and disposal)."],
      ["personal_items_stored", "All personal items in the home have been stored properly and safely (i.e. nothing stacked in an unstable manner; nothing leaning against doors, exits, fire extinguishing equipment or electrical panels, etc.)."],
      ["knives_stored", "All knives and other sharp objects are stored properly and in a safe place (i.e. knife block or drawer, with handles facing the front)."],
      ["emergency_plan_present", "Emergency Contacts list and a clear Emergency Plan are present and readily accessible in the home."],
      ["first_aid_present", "Basic First Aid supplies are available in the home."],
    ].freeze

    TRANSFER_CHECKS = [
      ["lifting_trained", "All attendants have been trained on proper lifting techniques."],
      ["client_feels_safe", "Client reports feeling safe during transfers with all attendants (if client cannot self-report, check with each attendant to ensure they feel safe performing client's transfers)."],
      ["transfer_safety_measures", "All possible safety measures have been implemented in areas where transfers occur (i.e. grab bars installed, non-slip mats placed in any slippery areas, etc.)."],
    ].freeze

    BEHAVIOR_CHECKS = [
      ["cpi_current", "All attendants are up-to-date on CPI training."],
      ["behavior_safety_measures", "All other possible safety measures have been implemented to protect employees when harmful behaviors occur (i.e. protective sleeves are readily available if client is prone to scratching or biting attendants, objects client uses regularly are padded if client is prone to throwing, etc.)."],
    ].freeze

    def self.ensure!
      new.ensure!
    end

    def ensure!
      template = Compliance::FormTemplate.find_or_initialize_by(slug: TEMPLATE_SLUG)
      template.assign_attributes(
        name: "Hazard Assessment and Correction Record",
        description: "IIPP home safety inspection completed on the program schedule (initial, quarterly site visits, new hazards, injuries, or when conditions warrant).",
        cadence: :quarterly,
        subject_type: :household,
        active: true,
        system: true,
        form_version: template.form_version.presence || 1,
      )
      template.save!

      sync_section!(template, "home_safety", "General Home Safety Inspection Checklist", 0, nil) do |section|
        HOME_SAFETY_CHECKS.each_with_index do |(key, label), index|
          sync_item!(section, key, label, :boolean_check, index)
        end

        text_start = HOME_SAFETY_CHECKS.length
        sync_item!(section, "dnr_location", "Does the client have a DNR? If so, is it clearly posted in the home? Note exact location (or state No).", :text, text_start)
        sync_item!(section, "emergency_contacts_location", "Note exact location of Emergency Contacts list and Emergency Plan here.", :text, text_start + 1)
        sync_item!(section, "first_aid_location", "Note exact location of First Aid supplies here.", :text, text_start + 2)
      end

      sync_section!(template, "manual_transfers", "For homes where manual transfers occur", 1, "manual_transfers") do |section|
        sync_item!(section, "manual_transfers_gate", "Manual transfers occur in this home.", :gate, 0, required: true)
        TRANSFER_CHECKS.each_with_index do |(key, label), index|
          sync_item!(section, key, label, :boolean_check, index + 1, show_when: "manual_transfers")
        end
      end

      sync_section!(template, "harmful_behaviors", "For homes where clients may engage in harmful behaviors", 2, "harmful_behaviors") do |section|
        sync_item!(section, "harmful_behaviors_gate", "Client may engage in harmful behaviors.", :gate, 0, required: true)
        BEHAVIOR_CHECKS.each_with_index do |(key, label), index|
          sync_item!(section, key, label, :boolean_check, index + 1, show_when: "harmful_behaviors")
        end
      end

      template
    end

    private

    def sync_section!(template, key, name, position, show_when)
      section = template.form_sections.find_or_initialize_by(key: key)
      section.assign_attributes(name: name, position: position, show_when: show_when)
      section.save!
      yield section if block_given?
      section
    end

    def sync_item!(section, key, label, kind, position, required: true, show_when: nil)
      item = section.form_items.find_or_initialize_by(key: key)
      item.assign_attributes(
        label: label,
        kind: kind,
        position: position,
        required: required,
        show_when: show_when,
      )
      item.save!
      item
    end
  end
end
