# SLS Scheduling Application

## Conventions

### Vite tsconfig-paths

Using tsconfig-paths allows static imports, but it does not recognize `baseUrl`. Use `@/` as an alias for the root directory as such:

```javascript
import Component from '@/Components/Component'
```

## Handling Shifts in DB

The shift exception table is an instance of a recurring shift which has been altered for a single instance. The `shift_id` field points to a *new* shift record, which itself points to the original shift through the `parent_id` field.
