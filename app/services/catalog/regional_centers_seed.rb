module Catalog
  class RegionalCentersSeed
    SNAPSHOT_PATH = Rails.root.join("lib/catalog/snapshots/regional_centers.json")

    def self.call
      new.call
    end

    def call
      entries.each do |entry|
        regional_center = RegionalCenter.find_or_initialize_by(code: entry.fetch("code"))
        regional_center.assign_attributes(
          name: entry.fetch("name"),
          active: entry.fetch("active", true),
        )
        regional_center.save!

        sync_contact!(regional_center, entry)
      end
    end

    private

    def entries
      JSON.parse(File.read(SNAPSHOT_PATH))
    end

    def sync_contact!(regional_center, entry)
      contact = regional_center.contact || regional_center.create_contact!

      if entry["website"].present?
        website = contact.websites.find_or_initialize_by(url: entry["website"])
        website.category ||= website_category
        website.save!
      end

      address_attrs = entry["address"]
      return if address_attrs.blank?

      address = contact.addresses.first || contact.addresses.build
      address.assign_attributes(
        address: address_attrs["address"],
        city: address_attrs["city"],
        region: address_attrs["region"],
        postal: address_attrs["postal"],
        country: address_attrs["country"],
      )
      address.category ||= address_category
      address.save!
    end

    def address_category
      @address_category ||= Category.type("Contact::Address").find_or_create_by!(name: "Primary") { |category|
        category.system = true
      }
    end

    def website_category
      @website_category ||= Category.type("Contact::Website").find_or_create_by!(name: "Business") { |category|
        category.system = true
      }
    end
  end
end
