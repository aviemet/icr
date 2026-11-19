class Vendors::PersistedSerializer < VendorSerializer
  include Persisted

  attributes(
    :slug,
  )
end
