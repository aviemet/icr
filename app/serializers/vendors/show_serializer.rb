class Vendors::ShowSerializer < VendorSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
