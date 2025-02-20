/*
  # Fix Order Table Relationships

  1. Changes
    - Add foreign key relationship between orders and payment_methods
    - Add missing indexes for better query performance
    - Update RLS policies to include payment method access

  2. Security
    - Maintain existing RLS policies
    - Add policy for payment method access in orders
*/

-- Add payment_method_id column to orders table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_method_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method_id uuid REFERENCES payment_methods(id);
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method_id ON orders(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address_id ON orders(shipping_address_id);
CREATE INDEX IF NOT EXISTS idx_orders_billing_address_id ON orders(billing_address_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Update RLS policy for orders to include payment method access
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM payment_methods
      WHERE payment_methods.id = orders.payment_method_id
      AND payment_methods.user_id = auth.uid()
    )
  );