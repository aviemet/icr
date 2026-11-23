class RenameComplianceFormTemplateVersion < ActiveRecord::Migration[8.0]
  def up
    return unless column_exists?(:compliance_form_templates, :version)
    return if column_exists?(:compliance_form_templates, :form_version)

    rename_column :compliance_form_templates, :version, :form_version
  end

  def down
    return unless column_exists?(:compliance_form_templates, :form_version)
    return if column_exists?(:compliance_form_templates, :version)

    rename_column :compliance_form_templates, :form_version, :version
  end
end
