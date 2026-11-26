class Vendors::IndexSerializer < VendorSerializer
  attributes(
    :id,
    :slug,
    :updated_at,
    :created_at,
  )
end
