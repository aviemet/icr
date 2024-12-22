class Households::IndexSerializer < HouseholdSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
