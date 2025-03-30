/**
 * @file Generated by js-routes 2.3.5. Based on Rails 7.2.2.1 routes of Icr::Application.
 * @version 55eb7c46d4d79fbcf648e591f40cd39ad825549ceaad68313487cb7c263c6071
 * @see https://github.com/railsware/js-routes
 */
declare type Optional<T> = {
    [P in keyof T]?: T[P] | null;
};
declare type Collection<T> = Record<string, T>;
declare type BaseRouteParameter = string | boolean | Date | number | bigint;
declare type MethodRouteParameter = BaseRouteParameter | (() => BaseRouteParameter);
declare type ModelRouteParameter = {
    id: MethodRouteParameter;
} | {
    to_param: MethodRouteParameter;
} | {
    toParam: MethodRouteParameter;
};
declare type RequiredRouteParameter = BaseRouteParameter | ModelRouteParameter;
declare type OptionalRouteParameter = undefined | null | RequiredRouteParameter;
declare type QueryRouteParameter = OptionalRouteParameter | QueryRouteParameter[] | {
    [k: string]: QueryRouteParameter;
};
declare type RouteParameters = Collection<QueryRouteParameter>;
declare type Serializable = Collection<unknown>;
declare type Serializer = (value: Serializable) => string;
declare type RouteHelperExtras = {
    requiredParams(): string[];
    toString(): string;
};
declare type RequiredParameters<T extends number> = T extends 1 ? [RequiredRouteParameter] : T extends 2 ? [RequiredRouteParameter, RequiredRouteParameter] : T extends 3 ? [RequiredRouteParameter, RequiredRouteParameter, RequiredRouteParameter] : T extends 4 ? [
    RequiredRouteParameter,
    RequiredRouteParameter,
    RequiredRouteParameter,
    RequiredRouteParameter
] : RequiredRouteParameter[];
declare type RouteHelperOptions = RouteOptions & Collection<OptionalRouteParameter>;
declare type RouteHelper<T extends number = number> = ((...args: [...RequiredParameters<T>, RouteHelperOptions]) => string) & RouteHelperExtras;
declare type RouteHelpers = Collection<RouteHelper>;
declare type Configuration = {
    prefix: string;
    default_url_options: RouteParameters;
    special_options_key: string;
    serializer: Serializer;
};
interface RouterExposedMethods {
    config(): Configuration;
    configure(arg: Partial<Configuration>): Configuration;
    serialize: Serializer;
}
declare type KeywordUrlOptions = Optional<{
    host: string;
    protocol: string;
    subdomain: string;
    port: string | number;
    anchor: string;
    trailing_slash: boolean;
    script_name: string;
    params: RouteParameters;
}>;
declare type RouteOptions = KeywordUrlOptions & RouteParameters;
declare type PartsTable = Collection<{
    r?: boolean;
    d?: OptionalRouteParameter;
}>;
declare type ModuleType = "CJS" | "AMD" | "UMD" | "ESM" | "DTS" | "NIL";
declare const RubyVariables: {
    PREFIX: string;
    DEPRECATED_FALSE_PARAMETER_BEHAVIOR: boolean;
    SPECIAL_OPTIONS_KEY: string;
    DEFAULT_URL_OPTIONS: RouteParameters;
    SERIALIZER: Serializer;
    ROUTES_OBJECT: RouteHelpers;
    MODULE_TYPE: ModuleType;
    WRAPPER: <T>(callback: T) => T;
};
declare const define: undefined | (((arg: unknown[], callback: () => unknown) => void) & {
    amd?: unknown;
});
declare const module: {
    exports: unknown;
} | undefined;
export const configure: RouterExposedMethods['configure'];

export const config: RouterExposedMethods['config'];

export const serialize: RouterExposedMethods['serialize'];

/**
 * Generates rails route to
 * /api/calendar_events/:id(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiCalendarEvent: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/calendar_events(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiCalendarEvents: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/categories(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiCategories: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/categories/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiCategory: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/categories/:category_type(.:format)
 * @param {any} categoryType
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiCategoryOptions: ((
  categoryType: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/clients(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiClientsOptions: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/locales/currencies(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiCurrencies: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/employees(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiEmployeesOptions: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/locales/languages(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiLanguages: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/locales/pay_periods(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiPayPeriods: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/spotlights(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiSpotlights: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/options/locales/timezones(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiTimezones: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/users/:id/update_table_preferences(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiUpdateTablePreferences: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/users/:id/update_user_preferences(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiUpdateUserPreferences: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/users/:id(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiUser: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /api/users(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const apiUsers: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/cancel(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const cancelUserRegistration: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /clients/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const client: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /clients(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const clients: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /logout(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const destroyUserSession: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /doctors/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const doctor: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /doctors(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const doctors: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /clients/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editClient: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /doctors/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editDoctor: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /employees/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editEmployee: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /households/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editHousehold: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /incident_reports/:id/edit(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editIncidentReport: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/edit(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editSettings: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/job_titles/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editSettingsJobTitle: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/people/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editSettingsPerson: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /shift_templates/:id/edit(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editShiftTemplate: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /timesheets/:id/edit(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editTimesheet: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/password/edit(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editUserPassword: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/edit(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editUserRegistration: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /vendors/:slug/edit(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const editVendor: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /employees/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const employee: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /employees(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const employees: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /404(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const error404: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /422(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const error422: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /500(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const error500: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /home(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const home: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /households/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const household: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /households(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const households: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /incident_reports/:id(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const incidentReport: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /incident_reports(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const incidentReports: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /clients/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newClient: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /doctors/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newDoctor: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /employees/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newEmployee: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /households/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newHousehold: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /incident_reports/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newIncidentReport: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/job_titles/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newSettingsJobTitle: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/people/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newSettingsPerson: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /shift_templates/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newShiftTemplate: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /timesheets/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newTimesheet: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/confirmation/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newUserConfirmation: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/password/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newUserPassword: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/register(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newUserRegistration: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /login(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newUserSession: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/unlock/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newUserUnlock: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /vendors/new(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const newVendor: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const root: ((
  options?: RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /clients/:slug/schedule(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const scheduleClient: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /employees/:slug/schedule(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const scheduleEmployee: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settings: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/general(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settingsGeneral: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/job_titles/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settingsJobTitle: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/job_titles(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settingsJobTitles: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/payroll(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settingsPayroll: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/people(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settingsPeople: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /settings/people/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const settingsPerson: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /shift_templates/:id(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const shiftTemplate: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /shift_templates(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const shiftTemplates: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /timesheets/:id(.:format)
 * @param {any} id
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const timesheet: ((
  id: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /timesheets(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const timesheets: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /rails/active_storage/disk/:encoded_token(.:format)
 * @param {any} encodedToken
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const updateRailsDiskService: ((
  encodedToken: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/confirmation(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const userConfirmation: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/password(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const userPassword: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const userRegistration: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /login(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const userSession: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /users/unlock(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const userUnlock: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /vendors/:slug(.:format)
 * @param {any} slug
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const vendor: ((
  slug: RequiredRouteParameter,
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

/**
 * Generates rails route to
 * /vendors(.:format)
 * @param {object | undefined} options
 * @returns {string} route path
 */
export const vendors: ((
  options?: {format?: OptionalRouteParameter} & RouteOptions
) => string) & RouteHelperExtras;

// By some reason this line prevents all types in a file
// from being automatically exported
export {};
