class Vendors::EditSerializer < VendorSerializer

  attributes(
    :id,
    :slug,
    :updated_at,
    :created_at,
  )
end
