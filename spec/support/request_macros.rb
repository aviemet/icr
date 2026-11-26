module RequestMacros
  def login_admin
    before do
      @admin = FactoryBot.create(:user, :admin)
      sign_in @admin
    end
  end

  def login_user(role)
    before do
      @user = FactoryBot.create(:user, :with_role, role: role)
      sign_in @user
    end
  end
end
