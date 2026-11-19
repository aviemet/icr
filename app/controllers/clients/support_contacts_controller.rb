class Clients::SupportContactsController < Clients::BaseController
  expose :support_contact, model: Client::SupportContact, scope: -> { client.support_contacts }

  strong_params :support_contact, permit: [
    :relationship, :priority, :is_emergency, :notes,
    person_attributes: [
      :id, :first_name, :last_name, :middle_name, :nick_name,
      contact_attributes: [
        :id,
        phones_attributes: [:id, :name, :number, :extension, :notes, :category_id, :_destroy],
        emails_attributes: [:id, :name, :email, :notes, :category_id, :_destroy],
        addresses_attributes: [
          :id, :name, :address, :address_2, :city, :region, :postal, :country, :notes, :category_id, :_destroy,
        ],
      ],
    ],
  ]

  # @route POST /clients/:client_slug/support_contacts (client_support_contacts)
  def create
    authorize_client_update!
    support_contact.assign_attributes(support_contact_params)
    support_contact.save
    redirect_to_client_tab("contacts")
  end

  # @route PATCH /clients/:client_slug/support_contacts/:id (client_support_contact)
  # @route PUT /clients/:client_slug/support_contacts/:id (client_support_contact)
  def update
    authorize_client_update!
    support_contact.update(support_contact_params)
    redirect_to_client_tab("contacts")
  end

  # @route DELETE /clients/:client_slug/support_contacts/:id (client_support_contact)
  def destroy
    authorize_client_update!
    support_contact.destroy!
    redirect_to_client_tab("contacts")
  end
end
