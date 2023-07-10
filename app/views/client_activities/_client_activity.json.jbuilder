json.extract! client_activity, :id, :title, :notes, :created_at, :updated_at
json.url client_activity_url(client_activity, format: :json)
