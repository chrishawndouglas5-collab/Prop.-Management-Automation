-- Add columns to track which customers have been processed each month
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS last_report_generated_month INTEGER,
ADD COLUMN IF NOT EXISTS last_report_generated_year INTEGER;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_report_tracking 
ON customers(last_report_generated_month, last_report_generated_year);
