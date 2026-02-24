class Doctors::OptionsSerializer < ApplicationSerializer
  object_as :doctor, model: "Doctor"

  include Persisted
  include PersonFields

  attributes(
    :slug,
  )
end
