class PermissionsController < ApplicationController
  expose :groups, -> { Permission::Group.includes(:assignments).order(precedence: :desc) }
  expose :group, -> { params[:id] ? Permission::Group.find(params[:id]) : Permission::Group.new(group_params) }

  strong_params :permission_group, permit: [
    :name,
    :description,
    :precedence,
    permissions: [
      :resource,
      :action,
      :effect,
      { conditions: [:owner_only, time_restricted: [:start_time, :end_time]] }
    ],
    assignments_attributes: [
      :id,
      :permissionable_type,
      :permissionable_id,
      :starts_at,
      :ends_at,
      :_destroy,
      { conditions: {} }
    ],
  ]

  def index
    render inertia: "Permissions/Index", props: {
      groups: groups.as_json(
        include: {
          assignments: {
            include: :permissionable
          }
        },
      )
    }
  end

  def show
    render inertia: "Permissions/Show", props: {
      group: group.as_json(
        include: {
          assignments: {
            include: :permissionable
          }
        },
      )
    }
  end

  def new
    render inertia: "Permissions/New", props: {
      group: group,
      assignable_types: ["User", "Employee::JobTitle"]
    }
  end

  def edit
    render inertia: "Permissions/Edit", props: {
      group: group.as_json(
        include: {
          assignments: {
            include: :permissionable
          }
        },
      ),
      assignable_types: ["User", "Employee::JobTitle"]
    }
  end

  def create
    if group.save
      redirect_to permissions_path, notice: t("templates.controllers.notices.created", model: "Permission group")
    else
      render inertia: "Permissions/New", props: {
        group: group.as_json(methods: [:errors]),
        assignable_types: ["User", "Employee::JobTitle"]
      }
    end
  end

  def update
    if group.update(group_params)
      redirect_to permissions_path, notice: t("templates.controllers.notices.updated", model: "Permission group")
    else
      render inertia: "Permissions/Edit", props: {
        group: group.as_json(
          include: {
            assignments: {
              include: :permissionable
            }
          },
          methods: [:errors],
        ),
        assignable_types: ["User", "Employee::JobTitle"]
      }
    end
  end

  def destroy
    group.destroy
    redirect_to permissions_path, notice: t("templates.controllers.notices.destroyed", model: "Permission group")
  end
end
