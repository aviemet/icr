class Settings::IndexSerializer < ApplicationSerializer
  object_as :setting

  attributes(
    :id,
  )
end
