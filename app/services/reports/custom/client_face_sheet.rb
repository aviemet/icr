# frozen_string_literal: true

module Reports
  module Custom
    class ClientFaceSheet < Base
      def build
        content = Pdf::Document.build(title: "Face Sheet", user: user) do |pdf|
          render_identity(pdf)
          render_allergies(pdf)
          render_diagnoses(pdf)
          render_prescriptions(pdf)
          render_trainings(pdf)
          pdf.start_new_page
          render_attendants(pdf)
        end

        {
          content: content,
          filename: filename,
          content_type: "application/pdf",
        }
      end

      private

      attr_reader :client

      def authorize!
        client_id = params.fetch("client_id")
        @client = Pundit.policy_scope!(user, Client)
          .includes(
            :identifications,
            :allergies,
            :diagnoses,
            :trainings,
            person: { contact: [:primary_address, :primary_phone] },
            prescriptions: [:medication, :dosage, { doctor: :person }],
            current_attendants: { person: { contact: :primary_phone } },
          )
          .find(client_id)
      rescue ActiveRecord::RecordNotFound
        raise Pundit::NotAuthorizedError, "not allowed to export this client face sheet"
      end

      def filename
        slug = client.slug.presence || client.id
        "client-face-sheet-#{slug}-#{Time.current.strftime('%Y%m%d-%H%M%S')}.pdf"
      end

      def render_identity(pdf)
        person = client.person
        contact = person&.contact
        address = contact&.primary_address
        phone = contact&.primary_phone

        pdf.fields(
          [
            ["Name", person&.name],
            ["Birth Date", format_date(person&.dob)],
            ["Sex", blank],
            ["Height", blank],
            ["Weight", blank],
            ["Hair Color", blank],
            ["Eye Color", blank],
            ["Identifying Characteristics", blank],
            ["SSN", blank],
            ["State Id #", state_id_number],
            ["Medi-Cal/Medicaid #", client.medi_cal_number],
            ["Medi-Care #", blank],
            ["UCI #", client.uci_number],
            ["Client #", client.number],
            ["Address", format_address(address)],
            ["Phone", phone&.number],
            ["Conserved", blank],
            ["Start Date", format_date(client.active_at)],
            ["Preferred Hospital", client.preferred_hospital],
            ["Comments", client.communication_notes],
          ],
        )
      end

      def render_allergies(pdf)
        pdf.section("Allergies")
        allergies = client.allergies.select(&:active?)
        if allergies.empty?
          pdf.paragraph(blank)
          return
        end

        allergies.each do |allergy|
          parts = [allergy.name, allergy.reaction.presence, allergy.severity.presence].compact
          pdf.paragraph(parts.join(" - "))
        end
      end

      def render_diagnoses(pdf)
        pdf.section("Diagnoses")
        diagnoses = client.diagnoses.select(&:active?)
        if diagnoses.empty?
          pdf.paragraph(blank)
          return
        end

        diagnoses.each do |diagnosis|
          label = [diagnosis.name, diagnosis.code.presence].compact.join(" / ")
          pdf.paragraph(label)
        end
      end

      def render_prescriptions(pdf)
        pdf.section("Medication")
        prescriptions = client.prescriptions.select { |prescription|
          prescription.starts_at.present? &&
            prescription.starts_at <= Date.current &&
            (prescription.ends_at.nil? || prescription.ends_at >= Date.current)
        }

        if prescriptions.empty?
          pdf.paragraph(blank)
          return
        end

        headers = [
          "Medication (Generic)",
          "Dosage/Strength",
          "Frequency",
          "Prescribed for",
          "Script by",
        ]
        rows = prescriptions.map { |prescription| prescription_row(prescription) }
        pdf.table(headers, rows)
      end

      def prescription_row(prescription)
        medication = prescription.medication
        dosage = prescription.dosage
        med_label = [medication&.name, medication&.generic_name.presence].compact.join(" / ")
        strength = [
          dosage&.amount,
          dosage&.amount_unit,
        ].compact.join(" ")
        frequency = dosage_frequency(dosage)

        [
          present(med_label),
          present(strength),
          present(frequency),
          present(client.name),
          present(prescription.doctor&.name),
        ]
      end

      def dosage_frequency(dosage)
        return if dosage.blank?

        amount = dosage.freq_amount
        period = dosage.freq_period
        return period.to_s.humanize if amount.blank?

        "#{amount} time(s) per #{period}"
      end

      def render_trainings(pdf)
        pdf.section("Immunizations/Clearances")
        trainings = client.trainings
        if trainings.empty?
          pdf.paragraph(blank)
          return
        end

        headers = ["Immunization/Clearance", "Most Recent Date", "Notes"]
        rows = trainings.map { |training|
          [present(training.name), blank, blank]
        }
        pdf.table(headers, rows)
      end

      def render_attendants(pdf)
        pdf.section("Employee Information")
        pdf.field("Company Phone #", blank)

        attendants = client.current_attendants
        if attendants.empty?
          pdf.paragraph(blank)
          return
        end

        headers = ["Employee", "Phone"]
        rows = attendants.map { |attendant|
          phone = attendant.person&.contact&.primary_phone&.number
          [present(attendant.name), present(phone)]
        }
        pdf.table(headers, rows)
      end

      def state_id_number
        identification = client.identifications.find(&:state_id?)
        identification&.number
      end

      def format_address(address)
        return if address.blank?

        [
          address.address,
          address.address_2.presence,
          [address.city, address.region, address.postal].compact_blank.join(", "),
        ].compact_blank.join(", ")
      end

      def format_date(value)
        return if value.blank?

        I18n.l(value.to_date)
      end
    end
  end
end
