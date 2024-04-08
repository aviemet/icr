class Households::ShowSerializer < HouseholdSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
