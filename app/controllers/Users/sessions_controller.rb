# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # GET /users/sign_in
  def new
    self.resource = User.new(sign_in_params)
    clean_up_passwords(resource)
    yield resource if block_given?
    render inertia: "Public/Login", props: {
      user: resource.as_json,
    }
  end

  # POST /users/sign_in
  # def create
  #   super
  # end

  # DELETE /users/sign_out
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    redirect_to new_user_session_path
  end
end
