class Employees::SupportContactsController < Employees::BaseController
  expose :support_contact, model: Employee::SupportContact, scope: -> { employee.support_contacts }

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

  def create
    authorize_employee_update!
    support_contact.assign_attributes(support_contact_params)
    support_contact.save
    redirect_to_employee_tab("contacts")
  end

  def update
    authorize_employee_update!
    support_contact.update(support_contact_params)
    redirect_to_employee_tab("contacts")
  end

  def destroy
    authorize_employee_update!
    support_contact.destroy!
    redirect_to_employee_tab("contacts")
  end
end
