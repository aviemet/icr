class Addresses::IndexSerializer < AddressSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
