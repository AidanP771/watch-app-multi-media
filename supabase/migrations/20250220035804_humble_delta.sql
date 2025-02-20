/*
  # Create Community Watch Marketplace Tables

  1. New Tables
    - `watch_listings`
      - `id` (uuid, primary key)
      - `seller_id` (uuid, references profiles)
      - `brand` (text)
      - `model` (text)
      - `reference_number` (text)
      - `year` (integer)
      - `condition_rating` (integer)
      - `condition_notes` (text)
      - `price` (numeric)
      - `location` (text)
      - `contact_preferences` (text[])
      - `images` (text[])
      - `authentication_docs` (text[])
      - `status` (text)
      - `views` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `listing_inquiries`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references watch_listings)
      - `buyer_id` (uuid, references profiles)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for listing management and viewing
    - Add policies for inquiry management
*/

-- Watch Listings Table
CREATE TABLE watch_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  brand text NOT NULL,
  model text NOT NULL,
  reference_number text,
  year integer,
  condition_rating integer CHECK (condition_rating BETWEEN 1 AND 10),
  condition_notes text,
  price numeric NOT NULL CHECK (price > 0),
  location text NOT NULL,
  contact_preferences text[] NOT NULL,
  images text[] NOT NULL CHECK (array_length(images, 1) >= 3),
  authentication_docs text[],
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived')),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Listing Inquiries Table
CREATE TABLE listing_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES watch_listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE watch_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for Watch Listings
CREATE POLICY "Anyone can view active listings"
  ON watch_listings
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Sellers can manage their own listings"
  ON watch_listings
  FOR ALL
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Policies for Listing Inquiries
CREATE POLICY "Buyers can view their own inquiries"
  ON listing_inquiries
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view inquiries for their listings"
  ON listing_inquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM watch_listings
      WHERE watch_listings.id = listing_id
      AND watch_listings.seller_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create inquiries"
  ON listing_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Add updated_at triggers
CREATE TRIGGER watch_listings_updated_at
  BEFORE UPDATE ON watch_listings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER listing_inquiries_updated_at
  BEFORE UPDATE ON listing_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_watch_listings_seller_id ON watch_listings(seller_id);
CREATE INDEX idx_watch_listings_status ON watch_listings(status);
CREATE INDEX idx_watch_listings_brand ON watch_listings(brand);
CREATE INDEX idx_watch_listings_price ON watch_listings(price);
CREATE INDEX idx_listing_inquiries_listing_id ON listing_inquiries(listing_id);
CREATE INDEX idx_listing_inquiries_buyer_id ON listing_inquiries(buyer_id);