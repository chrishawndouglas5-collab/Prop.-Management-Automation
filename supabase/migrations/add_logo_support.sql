-- Add logo_url column to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS logo_url TEXT;
