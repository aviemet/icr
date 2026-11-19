class Doctors::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "doctor".freeze

  object_as :doctor, model: "Doctor"

  include PersonFields

  attributes(:slug)
end
