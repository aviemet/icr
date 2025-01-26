module RequestMacros
  def login_admin
    before do
      @admin = FactoryBot.create(:user)
      @admin.confirm
      @admin.add_role(:admin)
      sign_in @admin
    end
  end

  def login_user(role)
    before do
      @user = FactoryBot.create(:user)
      @user.confirm
      @user.add_role(role)
      sign_in @user
    end
  end
end
