class Vendors::IndexSerializer < VendorSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
