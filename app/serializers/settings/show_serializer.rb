class Settings::ShowSerializer < ApplicationSerializer
  object_as :setting

  attributes(
    :id,
  )
end
