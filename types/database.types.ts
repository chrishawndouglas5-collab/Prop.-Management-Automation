export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string
                    user_id: string
                    company_name: string
                    contact_name: string | null
                    contact_email: string | null
                    unit_count: number
                    price_per_unit: number
                    billing_type: 'monthly' | 'annual' | null
                    paddle_customer_id: string | null
                    paddle_subscription_id: string | null
                    status: 'active' | 'past_due' | 'canceled' | 'trialing' | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_name: string
                    contact_name?: string | null
                    contact_email?: string | null
                    unit_count?: number
                    price_per_unit?: number
                    billing_type?: 'monthly' | 'annual' | null
                    paddle_customer_id?: string | null
                    paddle_subscription_id?: string | null
                    status?: 'active' | 'past_due' | 'canceled' | 'trialing' | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_name?: string
                    contact_name?: string | null
                    contact_email?: string | null
                    unit_count?: number
                    price_per_unit?: number
                    billing_type?: 'monthly' | 'annual' | null
                    paddle_customer_id?: string | null
                    paddle_subscription_id?: string | null
                    status?: 'active' | 'past_due' | 'canceled' | 'trialing' | null
                    created_at?: string
                    updated_at?: string
                }
            }
            properties: {
                Row: {
                    id: string
                    customer_id: string
                    property_name: string
                    address: string | null
                    unit_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    property_name: string
                    address?: string | null
                    unit_count: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    property_name?: string
                    address?: string | null
                    unit_count?: number
                    created_at?: string
                }
            }
            property_data: {
                Row: {
                    id: string
                    customer_id: string
                    property_id: string | null
                    transaction_date: string | null
                    category: string | null
                    description: string | null
                    amount: number | null
                    transaction_type: 'income' | 'expense' | null
                    upload_batch_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    property_id?: string | null
                    transaction_date?: string | null
                    category?: string | null
                    description?: string | null
                    amount?: number | null
                    transaction_type?: 'income' | 'expense' | null
                    upload_batch_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    property_id?: string | null
                    transaction_date?: string | null
                    category?: string | null
                    description?: string | null
                    amount?: number | null
                    transaction_type?: 'income' | 'expense' | null
                    upload_batch_id?: string | null
                    created_at?: string
                }
            }
            reports: {
                Row: {
                    id: string
                    customer_id: string
                    property_id: string | null
                    report_month: number | null
                    report_year: number | null
                    pdf_url: string | null
                    storage_path: string | null
                    generated_at: string | null
                    sent_at: string | null
                    status: 'pending' | 'generated' | 'sent' | 'failed' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    customer_id: string
                    property_id?: string | null
                    report_month?: number | null
                    report_year?: number | null
                    pdf_url?: string | null
                    storage_path?: string | null
                    generated_at?: string | null
                    sent_at?: string | null
                    status?: 'pending' | 'generated' | 'sent' | 'failed' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    customer_id?: string
                    property_id?: string | null
                    report_month?: number | null
                    report_year?: number | null
                    pdf_url?: string | null
                    storage_path?: string | null
                    generated_at?: string | null
                    sent_at?: string | null
                    status?: 'pending' | 'generated' | 'sent' | 'failed' | null
                    created_at?: string
                }
            }
            // Add other tables as needed...
        }
    }
}
