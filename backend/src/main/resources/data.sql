-- FreshGuard Seed Data

USE freshguard;

-- Seed Barcode Catalog
INSERT IGNORE INTO barcode_product_catalog (id, barcode, product_name, brand, category, default_expiry_days) VALUES
(1, '074901700609', 'Oreo Cookies (Family Size)', 'Nabisco', 'Snacks', 365),
(2, '5449000000996', 'Coca-Cola Original 330ml', 'Coca-Cola', 'Beverages', 180),
(3, '038000181719', 'Kellogg\'s Corn Flakes', 'Kellogg\'s', 'Breakfast Cereal', 365),
(4, '8901030000010', 'Amul Butter Pasteurized 500g', 'Amul', 'Dairy', 180),
(5, '8901058852332', 'Maggi 2-Minute Masala Noodles', 'Nestle', 'Instant Food', 270),
(6, '8901262010012', 'Tata Salt Vacuum Evaporated Iodized Salt 1kg', 'Tata', 'Staples', 730),
(7, '8901030583940', 'Amul Taaza Homogenised Toned Milk 1L', 'Amul', 'Dairy', 90),
(8, '8901719101037', 'Parle-G Original Glucose Biscuits 800g', 'Parle', 'Biscuits', 180),
(9, '8901491101833', 'Lay\'s India\'s Magic Masala Potato Chips 50g', 'Lay\'s', 'Snacks', 120),
(10, '8901030013584', 'Amul Masti Dahi 400g', 'Amul', 'Dairy', 15),
(11, '8901063012783', 'Britannia Good Day Butter Cookies 200g', 'Britannia', 'Biscuits', 180),
(12, '8901725181221', 'Aashirvaad Superior MP Sharbati Atta 5kg', 'ITC', 'Staples', 180),
(13, '8901030383182', 'Amul Cheese Block 200g', 'Amul', 'Dairy', 270),
(14, '8901058862416', 'Nescafe Classic Instant Coffee 100g Jar', 'Nestle', 'Beverages', 730),
(15, '8901052002014', 'Kissan Fresh Tomato Ketchup 500g', 'Kissan', 'Condiments', 365),
(16, '8901030865428', 'Brooke Bond Red Label Tea 500g', 'Brooke Bond', 'Beverages', 365),
(17, '8901396116123', 'Fortune Sunlite Refined Sunflower Oil 1L', 'Fortune', 'Cooking Oil', 270),
(18, '8901030353468', 'Mother Dairy Fresh Cow Milk 500ml', 'Mother Dairy', 'Dairy', 2),
(19, '8901725131011', 'Sunfeast Dark Fantasy Choco Fills 300g', 'ITC', 'Biscuits', 180),
(20, '8901207010411', 'Haldiram\'s Nagpur Bhujia Sev 400g', 'Haldiram\'s', 'Snacks', 180),
(21, '8901030013454', 'Amul Fresh Malai Paneer 200g', 'Amul', 'Dairy', 45),
(22, '8901063142213', 'Britannia Whole Wheat Brown Bread 400g', 'Britannia', 'Bakery', 5),
(23, '8901058849189', 'KitKat 4 Finger Chocolate Wafer Bar 38.5g', 'Nestle', 'Confectionery', 270),
(24, '8901491001010', 'Kurkure Masala Munch Crispy Snack 90g', 'PepsiCo', 'Snacks', 120),
(25, '8901030022418', 'Amul Pure Ghee Pouch 1L', 'Amul', 'Dairy', 270),
(26, '8901262020011', 'Tata Sampann Unpolished Toor Dal 1kg', 'Tata', 'Staples', 365);

-- Seed Recipes
INSERT IGNORE INTO recipes (id, title, description, cook_time, servings, difficulty, steps) VALUES
(1, 'Chicken Tomato Stir Fry', 'A quick, flavorful, and healthy stir fry using fresh tomatoes, tender chicken breast, and aromatic onions.', '25 mins', '4 servings', 'Easy', '["Slice chicken breasts into thin bite-sized strips.", "Heat olive oil in a wok or large pan over medium-high heat.", "Saute diced onions and minced garlic until fragrant (about 2 mins).", "Add chicken and cook until lightly browned (6-8 mins).", "Toss in chopped tomatoes and season with salt, pepper, and herbs.", "Simmer for 5 mins until tomatoes break down into a glossy glaze. Serve hot with steamed rice."]' ),
(2, 'Tomato Chicken Curry', 'Rich, comforting, and deeply spiced homestyle Indian chicken curry with a luscious tomato-onion gravy.', '40 mins', '4 servings', 'Medium', '["Heat oil in a heavy pot and crackle cumin seeds.", "Add finely chopped onions and ginger-garlic paste; saute until deep golden brown.", "Add turmeric, chili powder, coriander powder, and garam masala.", "Add pureed tomatoes and cook until oil separates from the masala (8-10 mins).", "Add chicken pieces, coat thoroughly, and add 1 cup warm water.", "Cover and simmer on low heat for 20 mins until chicken is tender. Garnish with fresh cilantro."]' ),
(3, 'Grilled Chicken Salad', 'Crisp, refreshing protein-packed salad with juicy marinated grilled chicken, cherry tomatoes, and salad greens.', '20 mins', '2 servings', 'Easy', '["Season chicken breasts with olive oil, lemon juice, salt, pepper, and Italian herbs.", "Grill on a grill pan for 5-6 mins per side until cooked through. Rest and slice.", "In a large bowl, combine torn fresh greens, halved cherry tomatoes, and sliced cucumbers.", "Toss with a simple vinaigrette (olive oil, lemon juice, Dijon mustard, salt).", "Top with sliced warm grilled chicken and shaved parmesan."]' ),
(4, 'Creamy Tomato Pasta', 'Silky, velvety pasta coated in a luxurious garlic, cream, and tomato reduction.', '20 mins', '3 servings', 'Easy', '["Boil penne or fettuccine in salted water until al dente; reserve 1/2 cup pasta water.", "In a skillet, melt butter with olive oil and saute minced garlic.", "Add crushed tomatoes and Italian seasoning; simmer for 8 minutes.", "Stir in heavy cream and grated parmesan cheese until silky and rich.", "Toss drained pasta into sauce with a splash of reserved water. Serve immediately with extra cheese."]' ),
(5, 'Vegetable Fried Rice', 'Savory wok-tossed long-grain rice with crisp carrots, garden peas, scallions, and savory soy sauce.', '15 mins', '3 servings', 'Easy', '["Heat sesame oil in a smoking hot wok over high heat.", "Add minced garlic, diced onions, finely chopped carrots, and green peas; stir-fry for 3 mins.", "Push vegetables to the side and scramble an egg (optional).", "Add cold cooked day-old rice, breaking clumps gently.", "Drizzle soy sauce, vinegar, and a pinch of white pepper. Toss vigorously for 2 mins until fragrant."]' ),
(6, 'Masala Omelette', 'Fluffy, vibrant spiced eggs loaded with chopped onions, juicy tomatoes, and fresh herbs.', '10 mins', '1 serving', 'Easy', '["Whisk 2-3 eggs in a bowl with a pinch of salt, turmeric, and red chili powder.", "Fold in finely chopped onions, diced tomatoes, green chilies, and coriander leaves.", "Heat butter or oil in a non-stick pan over medium heat.", "Pour egg mixture and swirl evenly. Cook until bottom is golden (2-3 mins).", "Flip carefully and cook the other side for 1 min. Serve hot with buttered toast."]' ),
(7, 'Fruit Smoothie Bowl', 'Energizing nutrient-dense breakfast bowl packed with creamy banana, mixed berries, and honeyed yogurt.', '10 mins', '2 servings', 'Easy', '["Add frozen bananas, mixed berries, Greek yogurt, milk, and honey into a high-speed blender.", "Blend on high until ultra-thick and velvety smooth.", "Pour into serving bowls.", "Artfully arrange toppings: sliced fresh bananas, chia seeds, granola, and shredded coconut.", "Drizzle with a touch of honey and enjoy chilled."]' ),
(8, 'Paneer Butter Masala', 'Classic North Indian restaurant favorite with soft paneer cubes simmered in a buttery, mildly sweet tomato sauce.', '35 mins', '4 servings', 'Medium', '["Melt butter in a pan and saute whole spices with chopped onions, tomatoes, cashews, and garlic.", "Cool and blend into a fine velvety puree.", "Melt extra butter in the pan, add the pureed gravy, chili powder, and kasuri methi.", "Simmer on low heat for 10 mins until fragrant.", "Gently add paneer cubes and warm heavy cream. Simmer for 3 mins and serve with naan or paratha."]' ),
(9, 'Classic Potato Salad', 'Creamy, tangy classic picnic potato salad with tender boiled potatoes, crisp onions, and creamy mustard dressing.', '25 mins', '6 servings', 'Easy', '["Boil cubed russet or Yukon Gold potatoes in salted water until fork-tender (12-15 mins). Drain and cool completely.", "In a large bowl, whisk mayonnaise, yellow mustard, a dash of vinegar, salt, and black pepper.", "Add cooled potatoes, finely diced red onions, and chopped celery or pickles.", "Toss gently until all potato cubes are evenly coated.", "Chill in the refrigerator for at least 1 hour before serving."]' ),
(10, 'Hearty Vegetable Soup', 'Warm, nourishing wholesome broth loaded with tender root vegetables, garden greens, and gentle herbs.', '30 mins', '4 servings', 'Easy', '["Heat olive oil in a soup pot over medium heat.", "Saute diced onions, minced garlic, celery, and chopped carrots for 5 mins.", "Add diced potatoes, chopped green beans, and canned diced tomatoes.", "Pour vegetable broth, add a bay leaf, thyme, salt, and pepper.", "Bring to a boil, then reduce heat, cover, and simmer for 20 mins until vegetables are tender. Serve hot."]' );

-- Seed Recipe Ingredients (lowercased for matching)
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient) VALUES
-- Recipe 1: Chicken Tomato Stir Fry
(1, 'chicken breast'), (1, 'tomatoes'), (1, 'onions'),
-- Recipe 2: Tomato Chicken Curry
(2, 'chicken breast'), (2, 'tomatoes'), (2, 'onions'), (2, 'garlic'), (2, 'ginger'),
-- Recipe 3: Grilled Chicken Salad
(3, 'chicken breast'), (3, 'tomatoes'), (3, 'lettuce'), (3, 'cucumber'),
-- Recipe 4: Creamy Tomato Pasta
(4, 'pasta'), (4, 'tomatoes'), (4, 'cream'), (4, 'garlic'), (4, 'cheese'),
-- Recipe 5: Vegetable Fried Rice
(5, 'rice'), (5, 'carrots'), (5, 'peas'), (5, 'onions'), (5, 'soy sauce'),
-- Recipe 6: Masala Omelette
(6, 'eggs'), (6, 'onions'), (6, 'tomatoes'), (6, 'green chilies'),
-- Recipe 7: Fruit Smoothie Bowl
(7, 'banana'), (7, 'milk'), (7, 'berries'), (7, 'honey'), (7, 'yogurt'),
-- Recipe 8: Paneer Butter Masala
(8, 'paneer'), (8, 'butter'), (8, 'tomatoes'), (8, 'cream'), (8, 'garlic'),
-- Recipe 9: Classic Potato Salad
(9, 'potatoes'), (9, 'mayonnaise'), (9, 'mustard'), (9, 'onions'),
-- Recipe 10: Hearty Vegetable Soup
(10, 'carrots'), (10, 'potatoes'), (10, 'beans'), (10, 'tomatoes'), (10, 'garlic');
