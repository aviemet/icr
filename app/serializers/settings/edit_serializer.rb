class Settings::EditSerializer < ApplicationSerializer
  object_as :setting

  attributes(
    :id,
  )
end
