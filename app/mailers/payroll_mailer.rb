class PayrollMailer < ApplicationMailer
  def approval_reminder
    @user = params[:user]
    @pay_period = params[:pay_period]
    @pending_count = params[:pending_count]
    @due_date = params[:due_date]
    @period_url = params[:period_url]
    @period_label = [
      I18n.l(@pay_period.starts_at.to_date, format: :long),
      I18n.l(@pay_period.ends_at.to_date, format: :long),
    ].join(" - ")

    mail(
      to: @user.email,
      subject: I18n.t(
        "payroll_mailer.approval_reminder.subject",
        count: @pending_count,
        period: @period_label,
      ),
    )
  end
end
