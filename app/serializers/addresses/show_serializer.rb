class Addresses::ShowSerializer < AddressSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
