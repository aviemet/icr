---
name: Global catalog architecture
overview: Add local RegionalCenter (Contactable, CA seed). Company belongs_to regional_center. Client replaces free-text regional_center with either a regional_center FK or an other referral string (privately funded). Control-plane sync remains future work.
todos:
  - id: regional-center-model
    content: Create regional_centers table (uuid, code, name, active) with Contactable; factory, model specs, Contactable shared examples
    status: completed
  - id: seed-ca-centers
    content: Commit CA regional centers snapshot JSON and required seed that upserts by code with contact stubs
    status: completed
  - id: company-association
    content: Add companies.regional_center_id; company settings form select; serializer/request specs
    status: completed
  - id: client-referral
    content: Replace clients.regional_center with regional_center_id + referred_by_other; mutually exclusive validation; migrate existing strings; update forms/serializers/specs
    status: completed
  - id: remove-string-field
    content: Remove free-text regional_center from Client params, UI, factories, overview; show regional center name or other string
    status: completed
isProject: false
---

# Regional centers + company association + client referral

## Scope

Tenant-local `RegionalCenter` now. Control-plane HTTP sync later; seed from a committed CA centers snapshot.

## Data model

```mermaid
flowchart LR
  RegionalCenter["RegionalCenter"]
  Contact["Contact via Contactable"]
  Company["Company"]
  Client["Client"]
  RegionalCenter --> Contact
  Company -->|"belongs_to regional_center"| RegionalCenter
  Client -->|"belongs_to regional_center optional"| RegionalCenter
  Client -->|"referred_by_other string optional"| OtherLabel["Other private funding label"]
```

### `RegionalCenter`

- UUID PK; unique stable `code` (e.g. `rceb`); `name`; `active` default true.
- `include Contactable` (same as [`Vendor`](app/models/vendor.rb) / [`Company`](app/models/company.rb)).
- Seed: California DDS regional centers JSON, upsert by `code`, ensure contact exists.
- Selects list `active` centers. No full admin CRUD in this slice.

### Company settings

- [`Company`](app/models/company.rb): `belongs_to :regional_center, optional: true`.
- [`Settings/Company/Form`](app/frontend/domains/Settings/Company/Form.tsx): regional-center select.
- Controller/serializer/request specs updated.

### Client referral (replaces `regional_center` string)

Not polymorphic. Two mutually exclusive options:

| Choice | Columns |
| --- | --- |
| Referred / funded via regional center | `regional_center_id` set; `referred_by_other` blank |
| Privately funded / other | `referred_by_other` string set; `regional_center_id` nil |

- Drop `clients.regional_center` string.
- Add `regional_center_id` (FK, optional) and `referred_by_other` (string, optional).
- Validation: at most one of the two set; both may be blank.
- UI: source toggle or select ("Regional center" / "Other"), then either center select or text field. Replace inputs in [`Clients/Form`](app/frontend/domains/Clients/Form/index.tsx) and [`Clients/Profile/Form`](app/frontend/domains/Clients/Profile/Form.tsx).
- Overview/show: regional center name, or the other string, or "-".
- Migration: map existing `regional_center` values to a matching `RegionalCenter` by name/code when possible; otherwise copy into `referred_by_other`.

## Non-goals this slice

- Control-plane app, HTTP sync, billing/marketing.
- Full RegionalCenter contact admin UI (Contactable on model + seeds; admin later).
