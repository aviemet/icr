class Addresses::EditSerializer < AddressSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
