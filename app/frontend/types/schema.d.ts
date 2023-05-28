export {}

declare namespace schema {
	interface User {
		id: number;
		email: string;
		encrypted_password: string;
		reset_password_token?: string | null;
		reset_password_sent_at?: string | null;
		remember_created_at?: string | null;
		sign_in_count: number;
		current_sign_in_at?: string | null;
		last_sign_in_at?: string | null;
		current_sign_in_ip?: string | null;
		last_sign_in_ip?: string | null;
		confirmation_token?: string | null;
		confirmed_at?: string | null;
		confirmation_sent_at?: string | null;
		unconfirmed_email?: string | null;
		failed_attempts: number;
		unlock_token?: string | null;
		locked_at?: string | null;
		created_at: string;
		updated_at: string;
		active?: boolean | null;
		time_zone?: string | null;
		person?: Person;
	}

	interface Person {
		id: number;
		f_name?: string | null;
		m_name?: string | null;
		l_name?: string | null;
		slug: string;
		person_type?: 'employee' | 'client' | null;
		user_id?: number | null;
		created_at: string;
		updated_at: string;
		contact?: Contact;
		addresses?: Address[];
		phones?: Phone[];
		emails?: Email[];
		user?: User;
	}

	interface Shift {
		id: number;
		starts_at?: string | null;
		ends_at?: string | null;
		recurring_pattern_id?: number | null;
		employee_id?: number | null;
		created_by_id: number;
		parent_id?: number | null;
		created_at: string;
		updated_at: string;
		clients?: Person[];
		employee?: Employee;
		created_by?: User;
		recurring_pattern?: RecurringPattern;
		shift_exceptions?: ShiftException[];
	}

	interface Address {
		id: number;
		title?: string | null;
		address?: string | null;
		address_2?: string | null;
		city?: string | null;
		region?: string | null;
		country?: string | null;
		postal?: string | null;
		notes?: string | null;
		contact_id: number;
		created_at: string;
		updated_at: string;
	}

	interface Contact {
		id: number;
		contactable_type: string;
		contactable_id: number;
		created_at: string;
		updated_at: string;
		primary_address_id?: number | null;
		primary_phone_id?: number | null;
		primary_email_id?: number | null;
		addresses?: Address[];
		emails?: Email[];
		phones?: Phone[];
	}

	interface Email {
		id: number;
		title?: string | null;
		email?: string | null;
		notes?: string | null;
		contact_id: number;
		created_at: string;
		updated_at: string;
	}

	interface Household {
		id: number;
		name?: string | null;
		created_at: string;
		updated_at: string;
		clients?: Person[];
	}

	interface Phone {
		id: number;
		title?: string | null;
		number?: string | null;
		extension?: string | null;
		notes?: string | null;
		contact_id: number;
		created_at: string;
		updated_at: string;
	}

	interface RecurringPattern {
		id: number;
		recurring_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
		offset: number;
		max_occurances?: number | null;
		end_date?: number | null;
		day_of_week?: number | null;
		week_of_month?: number | null;
		day_of_month?: number | null;
		month_of_year?: number | null;
		created_at: string;
		updated_at: string;
		shift?: Shift;
	}

	interface ShiftException {
		id: number;
		shift_id: number;
		rescheduled?: string | null;
		cancelled?: string | null;
		starts_at?: string | null;
		ends_at?: string | null;
		created_at: string;
		updated_at: string;
		shift?: Shift;
	}


}
