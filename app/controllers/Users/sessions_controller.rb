# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # GET /resource/sign_in
  def new
    self.resource = User.new(sign_in_params)
    clean_up_passwords(resource)
    yield resource if block_given?
    render inertia: "Public/Login", props: {
      user: resource,
    }
  end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end
end
