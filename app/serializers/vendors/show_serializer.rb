class Vendors::ShowSerializer < VendorSerializer
  attributes(
    :id,
    :slug,
    :updated_at,
    :created_at,
  )
end
