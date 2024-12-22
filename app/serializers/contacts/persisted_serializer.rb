class Contacts::PersistedSerializer < ContactSerializer
  include Persisted

  has_many :addresses, serializer: AddressSerializer
  has_many :emails, serializer: EmailSerializer
  has_many :phones, serializer: PhoneSerializer
end
