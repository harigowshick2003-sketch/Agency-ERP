-- ═══════════════════════════════════════════════════════════════════
--  Agency ERP — Sample Data Seed
--  Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. UPDATE EXISTING EMPLOYEES ────────────────────────────────────
UPDATE employees SET role='Designer',              department='Creative',    email='hari@agency.com'    WHERE emp_id='emp1';
UPDATE employees SET role='Video Editor',          department='Creative',    email='mic@agency.com'     WHERE emp_id='emp2';
UPDATE employees SET role='Social Media Manager',  department='Strategy',    email='darshan@agency.com' WHERE emp_id='emp3';
UPDATE employees SET role='Content Writer',        department='Content',     email='alagesh@agency.com' WHERE emp_id='emp4';

-- ── 2. ADD MORE EMPLOYEES ────────────────────────────────────────────
INSERT INTO employees (name, emp_id, role, department, email) VALUES
  ('Priya Sharma', 'emp5', 'Account Manager',     'Management', 'priya@agency.com'),
  ('Rohan Mehta',  'emp6', 'Photographer',         'Creative',   'rohan@agency.com'),
  ('Sneha Patel',  'emp7', 'Content Writer',       'Content',    'sneha@agency.com'),
  ('Dev Kapoor',   'emp8', 'Social Media Manager', 'Strategy',   'dev@agency.com')
ON CONFLICT DO NOTHING;

-- ── 3. INSERT CLIENTS ────────────────────────────────────────────────
DELETE FROM clients WHERE name = 'Test Brand';

INSERT INTO clients (id, client_code, name, industry, brand_tone, contact_name, contact_email, contact_phone) VALUES
  ('11111111-0000-0000-0000-000000000001','ZAR001','Zara India',           'Fashion',           'Aspirational & Bold',        'Ananya Roy',   'ananya@zaraindia.com', '+91 98100 11111'),
  ('11111111-0000-0000-0000-000000000002','FIT001','FitLife Nutrition',    'Health & Wellness', 'Energetic & Trustworthy',    'Ravi Nair',    'ravi@fitlife.com',     '+91 98200 22222'),
  ('11111111-0000-0000-0000-000000000003','URB001','Urban Nest Interiors', 'Interior Design',   'Elegant & Minimal',          'Meena Iyer',   'meena@urbannest.com',  '+91 98300 33333'),
  ('11111111-0000-0000-0000-000000000004','TWV001','TechWave Solutions',   'Technology',        'Professional & Cutting-edge','Arjun Bose',   'arjun@techwave.com',   '+91 98400 44444'),
  ('11111111-0000-0000-0000-000000000005','BRW001','Brew House Cafe',      'Food & Beverage',   'Warm & Friendly',            'Kavita Reddy', 'kavita@brewhouse.com', '+91 98500 55555')
ON CONFLICT (id) DO NOTHING;

-- ── 4. INSERT DELIVERABLES ───────────────────────────────────────────
INSERT INTO deliverables (id, client_id, activity_code, activity_type, date, platform, notes) VALUES
  ('22222222-0000-0000-0000-000000000001','11111111-0000-0000-0000-000000000001','ZAR001-P01','AT001','2026-04-10','Instagram','Summer collection launch post'),
  ('22222222-0000-0000-0000-000000000002','11111111-0000-0000-0000-000000000001','ZAR001-R01','AT002','2026-04-11','Instagram','Behind the scenes reel'),
  ('22222222-0000-0000-0000-000000000003','11111111-0000-0000-0000-000000000001','ZAR001-P02','AT001','2026-04-14','Instagram','New arrivals carousel'),
  ('22222222-0000-0000-0000-000000000004','11111111-0000-0000-0000-000000000001','ZAR001-R02','AT002','2026-04-16','Instagram','Styling tips reel'),
  ('22222222-0000-0000-0000-000000000005','11111111-0000-0000-0000-000000000001','ZAR001-YS1','AT004','2026-04-18','YouTube','Summer haul shorts video'),
  ('22222222-0000-0000-0000-000000000006','11111111-0000-0000-0000-000000000002','FIT001-P01','AT001','2026-04-09','Instagram','Protein shake recipe post'),
  ('22222222-0000-0000-0000-000000000007','11111111-0000-0000-0000-000000000002','FIT001-R01','AT002','2026-04-10','Instagram','Workout motivation reel'),
  ('22222222-0000-0000-0000-000000000008','11111111-0000-0000-0000-000000000002','FIT001-YL1','AT005','2026-04-12','YouTube','Full body workout guide'),
  ('22222222-0000-0000-0000-000000000009','11111111-0000-0000-0000-000000000002','FIT001-P02','AT001','2026-04-15','Instagram','Before/after transformation'),
  ('22222222-0000-0000-0000-000000000010','11111111-0000-0000-0000-000000000002','FIT001-R02','AT002','2026-04-19','Instagram','5 tips for better nutrition'),
  ('22222222-0000-0000-0000-000000000011','11111111-0000-0000-0000-000000000003','URB001-P01','AT001','2026-04-08','Instagram','Living room makeover reveal'),
  ('22222222-0000-0000-0000-000000000012','11111111-0000-0000-0000-000000000003','URB001-R01','AT002','2026-04-11','Instagram','Kitchen decor reel'),
  ('22222222-0000-0000-0000-000000000013','11111111-0000-0000-0000-000000000003','URB001-P02','AT001','2026-04-15','Instagram','Minimalist bedroom ideas'),
  ('22222222-0000-0000-0000-000000000014','11111111-0000-0000-0000-000000000004','TWV001-P01','AT001','2026-04-07','LinkedIn','Product launch announcement'),
  ('22222222-0000-0000-0000-000000000015','11111111-0000-0000-0000-000000000004','TWV001-YL1','AT005','2026-04-13','YouTube','Product demo video'),
  ('22222222-0000-0000-0000-000000000016','11111111-0000-0000-0000-000000000004','TWV001-P02','AT001','2026-04-17','LinkedIn','Company culture post'),
  ('22222222-0000-0000-0000-000000000017','11111111-0000-0000-0000-000000000005','BRW001-P01','AT001','2026-04-09','Instagram','New menu item reveal'),
  ('22222222-0000-0000-0000-000000000018','11111111-0000-0000-0000-000000000005','BRW001-R01','AT002','2026-04-12','Instagram','Latte art reel'),
  ('22222222-0000-0000-0000-000000000019','11111111-0000-0000-0000-000000000005','BRW001-YS1','AT004','2026-04-16','YouTube','Brewing process shorts'),
  ('22222222-0000-0000-0000-000000000020','11111111-0000-0000-0000-000000000005','BRW001-P02','AT001','2026-04-19','Instagram','Weekend special offer')
ON CONFLICT (id) DO NOTHING;

-- ── 5. INSERT DAILY TRACKER ──────────────────────────────────────────
INSERT INTO daily_tracker (deliverable_id, content_status, creative_status, client_status, posting_status) VALUES
  ('22222222-0000-0000-0000-000000000001','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000002','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000003','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000004','Content Approved','Creative WIP','Sent to Client','Not Posted'),
  ('22222222-0000-0000-0000-000000000005','Content Not Written','Creative Not Started','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000006','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000007','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000008','Content Approved','Creative WIP','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000009','Content Remarks Given','Creative Not Started','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000010','Content Not Written','Creative Not Started','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000011','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000012','Content Approved','Creative Done','Sent to Client','Not Posted'),
  ('22222222-0000-0000-0000-000000000013','Content Not Written','Creative Not Started','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000014','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000015','Content Approved','Creative WIP','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000016','Content Not Written','Creative Not Started','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000017','Content Approved','Creative Approved','Client Approved','Posted'),
  ('22222222-0000-0000-0000-000000000018','Content Approved','Creative Approved','Client Remarks Given','Not Posted'),
  ('22222222-0000-0000-0000-000000000019','Content Approved','Creative WIP','Not Sent','Not Posted'),
  ('22222222-0000-0000-0000-000000000020','Content Not Written','Creative Not Started','Not Sent','Not Posted');

-- ── 6. INSERT JOB TRACKER ────────────────────────────────────────────
INSERT INTO job_tracker (deliverable_id, assigned_to, task_type, is_correction, status, notes)
SELECT '22222222-0000-0000-0000-000000000001', id, 'Design',        false, 'Done',        'Final creative approved' FROM employees WHERE emp_id='emp1' UNION ALL
SELECT '22222222-0000-0000-0000-000000000001', id, 'Copywriting',   false, 'Done',        'Caption approved'        FROM employees WHERE emp_id='emp4' UNION ALL
SELECT '22222222-0000-0000-0000-000000000002', id, 'Video Edit',    false, 'Done',        'Reel exported'           FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000002', id, 'Photography',   false, 'Done',        'Shoot completed'         FROM employees WHERE emp_id='emp6' UNION ALL
SELECT '22222222-0000-0000-0000-000000000003', id, 'Design',        false, 'Done',        'Carousel done'           FROM employees WHERE emp_id='emp1' UNION ALL
SELECT '22222222-0000-0000-0000-000000000004', id, 'Design',        false, 'In Progress', 'Reel thumbnail in progress' FROM employees WHERE emp_id='emp1' UNION ALL
SELECT '22222222-0000-0000-0000-000000000004', id, 'Video Edit',    true,  'In Progress', 'Re-edit after client remarks' FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000005', id, 'Copywriting',   false, 'Pending',     'Brief not received'      FROM employees WHERE emp_id='emp7' UNION ALL
SELECT '22222222-0000-0000-0000-000000000006', id, 'Design',        false, 'Done',        'Infographic complete'    FROM employees WHERE emp_id='emp1' UNION ALL
SELECT '22222222-0000-0000-0000-000000000006', id, 'Copywriting',   false, 'Done',        'Recipe copy done'        FROM employees WHERE emp_id='emp7' UNION ALL
SELECT '22222222-0000-0000-0000-000000000007', id, 'Video Edit',    false, 'Done',        null                      FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000008', id, 'Video Edit',    false, 'In Progress', 'Long-form editing'       FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000009', id, 'Copywriting',   true,  'In Progress', 'Caption corrections'     FROM employees WHERE emp_id='emp4' UNION ALL
SELECT '22222222-0000-0000-0000-000000000010', id, 'Copywriting',   false, 'Pending',     null                      FROM employees WHERE emp_id='emp7' UNION ALL
SELECT '22222222-0000-0000-0000-000000000011', id, 'Design',        false, 'Done',        'Before/after collage'    FROM employees WHERE emp_id='emp1' UNION ALL
SELECT '22222222-0000-0000-0000-000000000011', id, 'Photography',   false, 'Done',        'Interior shoot done'     FROM employees WHERE emp_id='emp6' UNION ALL
SELECT '22222222-0000-0000-0000-000000000012', id, 'Video Edit',    false, 'In Progress', 'Kitchen reel editing'    FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000013', id, 'Copywriting',   false, 'Pending',     null                      FROM employees WHERE emp_id='emp7' UNION ALL
SELECT '22222222-0000-0000-0000-000000000014', id, 'Social Media Management', false,'Done','Posted on LinkedIn'    FROM employees WHERE emp_id='emp8' UNION ALL
SELECT '22222222-0000-0000-0000-000000000014', id, 'Copywriting',   false, 'Done',        null                      FROM employees WHERE emp_id='emp4' UNION ALL
SELECT '22222222-0000-0000-0000-000000000015', id, 'Video Edit',    false, 'In Progress', 'Product demo cut'        FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000016', id, 'Copywriting',   false, 'Pending',     null                      FROM employees WHERE emp_id='emp7' UNION ALL
SELECT '22222222-0000-0000-0000-000000000017', id, 'Design',        false, 'Done',        'Menu graphic designed'   FROM employees WHERE emp_id='emp1' UNION ALL
SELECT '22222222-0000-0000-0000-000000000018', id, 'Video Edit',    false, 'In Progress', 'Latte art reel'          FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000018', id, 'Photography',   true,  'Done',        'Reshoot done'            FROM employees WHERE emp_id='emp6' UNION ALL
SELECT '22222222-0000-0000-0000-000000000019', id, 'Video Edit',    false, 'In Progress', null                      FROM employees WHERE emp_id='emp2' UNION ALL
SELECT '22222222-0000-0000-0000-000000000020', id, 'Copywriting',   false, 'Pending',     null                      FROM employees WHERE emp_id='emp4';

-- ── 7. INSERT CONTENT DETAILS ────────────────────────────────────────
INSERT INTO content_details (deliverable_id, title, copy, description, content_approval_status) VALUES
  ('22222222-0000-0000-0000-000000000001','Summer Collection Drop',   'Step into summer with our bold new arrivals. Shop now! ☀️ #ZaraIndia #SummerFashion',          'Instagram carousel for summer 2026 launch',    'Content Approved'),
  ('22222222-0000-0000-0000-000000000002','BTS Shoot Reel',           'Ever wonder how a fashion shoot comes together? 🎬 Swipe to see the magic. #BehindTheScenes',   'Behind the scenes reel from summer shoot',     'Content Approved'),
  ('22222222-0000-0000-0000-000000000003','New Arrivals ✨',           'Fresh fits just dropped. Which one is your summer vibe? 🌅 #ZaraIndia #OOTD',                  'New arrivals carousel post',                   'Content Approved'),
  ('22222222-0000-0000-0000-000000000006','Boost Your Day 💪',        'Fuel your goals with our whey protein. 3 flavours, 0 compromises. #FitLife #Protein',           'Product highlight post for protein range',     'Content Approved'),
  ('22222222-0000-0000-0000-000000000007','Rise & Grind 🔥',          'No excuses. Just results. Tag a gym buddy! #MondayMotivation #FitLife',                        'Workout motivation reel with gym clips',       'Content Approved'),
  ('22222222-0000-0000-0000-000000000009','Transformation Tuesday',   'Your journey starts with one step. 💫 Share your before & after in the comments! #FitLife',    'Before/after transformation post',             'Content Remarks Given'),
  ('22222222-0000-0000-0000-000000000011','Living Room Reveal ✨',     'From cluttered to curated. See the full transformation! 🏠 #InteriorDesign #UrbanNest',         'Full room makeover reveal with before/after',  'Content Approved'),
  ('22222222-0000-0000-0000-000000000012','Kitchen Magic 🍳',          'Small space, big impact. Here''s how we transformed this compact kitchen. #HomeDecor',          'Kitchen remodel reel',                        'Content Approved'),
  ('22222222-0000-0000-0000-000000000014','We Are Live! 🚀',           'TechWave Solutions is thrilled to announce the launch of our AI-powered platform. Learn more ↗','LinkedIn product launch announcement',         'Content Approved'),
  ('22222222-0000-0000-0000-000000000017','New Menu Dropped ☕',       'Fresh brews, new flavours. Come discover what''s new at Brew House this season! ☕ #BrewHouse', 'New menu item promotional post',               'Content Approved'),
  ('22222222-0000-0000-0000-000000000018','Latte Art 🎨',             'Our baristas are artists. Every cup tells a story. 🎨 #LatteArt #BrewHouse #CoffeeLover',       'Latte art showcase reel',                     'Content Approved');

-- ── VERIFY ───────────────────────────────────────────────────────────
SELECT 'clients'         AS tbl, COUNT(*) AS rows FROM clients         UNION ALL
SELECT 'employees',              COUNT(*)          FROM employees        UNION ALL
SELECT 'deliverables',           COUNT(*)          FROM deliverables     UNION ALL
SELECT 'daily_tracker',          COUNT(*)          FROM daily_tracker    UNION ALL
SELECT 'job_tracker',            COUNT(*)          FROM job_tracker      UNION ALL
SELECT 'content_details',        COUNT(*)          FROM content_details;
