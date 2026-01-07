CREATE TABLE IF NOT EXISTS pricing_tiers (
    id TEXT PRIMARY KEY, -- Using TEXT to keep existing IDs like 'tier_starter'
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    popular BOOLEAN DEFAULT false,
    color TEXT DEFAULT 'from-blue-500 to-cyan-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON pricing_tiers;
CREATE POLICY "Allow public read access" ON pricing_tiers FOR SELECT USING (true);

-- Allow admin full access
DROP POLICY IF EXISTS "Allow admin full access" ON pricing_tiers;
CREATE POLICY "Allow admin full access" ON pricing_tiers FOR ALL USING (
  exists (
    select 1 from user_profiles
    where user_profiles.id = auth.uid()
    and user_profiles.role = 'admin'
  )
);

-- Seed initial data
INSERT INTO pricing_tiers (id, name, price, credits, description, popular, color)
VALUES
    ('tier_starter', 'Starter', 89, 100, 'เหมาะสำหรับผู้เริ่มต้น', false, 'from-blue-500 to-cyan-500'),
    ('tier_pro', 'Pro Value', 249, 350, '(ประหยัด 20%) ได้เครดิตเยอะขึ้นอย่างเห็นได้ชัด', true, 'from-amber-500 to-orange-500'),
    ('tier_whale', 'Fortune', 599, 1000, '(ประหยัด 33%) ลดราคาเหมือนได้ฟรี 1 ใน 3', false, 'from-purple-500 to-pink-500')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    credits = EXCLUDED.credits,
    description = EXCLUDED.description,
    popular = EXCLUDED.popular,
    color = EXCLUDED.color;
