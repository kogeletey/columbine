INSERT INTO users (name, email, password, preferences) VALUES
('Alice Johnson', 'alice.johnson@example.com', 'password123', 'Vegetarian, No Gluten'),
('Bob Smith', 'bob.smith@example.com', 'password123', 'Low Carb, High Protein'),
('Charlie Brown', 'charlie.brown@example.com', 'password123', 'Vegan, No Dairy'),
('Diana Prince', 'diana.prince@example.com', 'password123', 'Paleo, No Sugar'),
('Evan Davis', 'evan.davis@example.com', 'password123', 'Keto, No Alcohol'),
('Fiona Green', 'fiona.green@example.com', 'password123', 'Pescatarian, Low Sodium'),
('George White', 'george.white@example.com', 'password123', 'Vegetarian, No Nuts'),
('Hannah Black', 'hannah.black@example.com', 'password123', 'Vegan, No Soy'),
('Ian Gray', 'ian.gray@example.com', 'password123', 'Low Carb, No Dairy'),
('Jane Doe', 'jane.doe@example.com', 'password123', 'Gluten-Free, No Sugar');

INSERT INTO chefs (name, bio, specialization) VALUES
('Gordon Ramsay', 'World-renowned chef with multiple Michelin stars.', 'French Cuisine'),
('Jamie Oliver', 'British chef known for his simple and healthy recipes.', 'Italian Cuisine'),
('Julia Child', 'Iconic chef who brought French cuisine to America.', 'French Cuisine'),
('Wolfgang Puck', 'Austrian-born chef with a global culinary empire.', 'Fusion Cuisine'),
('Nigella Lawson', 'Celebrity chef known for her indulgent desserts.', 'Desserts'),
('Anthony Bourdain', 'Chef, author, and travel documentarian.', 'Global Cuisine'),
('Alice Waters', 'Pioneer of the farm-to-table movement.', 'Organic Cuisine'),
('Massimo Bottura', 'Italian chef with a focus on modern Italian cuisine.', 'Italian Cuisine'),
('Heston Blumenthal', 'Innovative chef known for molecular gastronomy.', 'Experimental Cuisine'),
('Yotam Ottolenghi', 'Chef specializing in Middle Eastern and Mediterranean cuisine.', 'Middle Eastern Cuisine');

INSERT INTO recipes (title, description, chef_id) VALUES
('Beef Wellington', 'A classic British dish with beef tenderloin and puff pastry.', 1),
('Spaghetti Carbonara', 'A creamy Italian pasta dish with eggs and cheese.', 2),
('Boeuf Bourguignon', 'A rich French stew made with beef and red wine.', 3),
('Chicken Tikka Masala', 'A flavorful Indian-inspired dish with grilled chicken.', 4),
('Chocolate Lava Cake', 'A decadent dessert with a gooey chocolate center.', 5),
('Pho Bo', 'A traditional Vietnamese beef noodle soup.', 6),
('Ratatouille', 'A French vegetable stew with eggplant and zucchini.', 7),
('Risotto al Tartufo', 'A luxurious Italian rice dish with truffles.', 8),
('Lemon Tart', 'A tangy and sweet dessert with a buttery crust.', 9),
('Shakshuka', 'A Middle Eastern dish with poached eggs in tomato sauce.', 10);

INSERT INTO ingredients (name) VALUES
('Beef Tenderloin'),
('Puff Pastry'),
('Spaghetti'),
('Eggs'),
('Parmesan Cheese'),
('Chicken Breast'),
('Tomatoes'),
('Chocolate'),
('Eggplant'),
('Zucchini');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(1, 1, '500g'),
(1, 2, '1 sheet'),
(2, 3, '200g'),
(2, 4, '2 eggs'),
(2, 5, '50g'),
(3, 1, '1kg'),
(3, 7, '500g'),
(4, 6, '500g'),
(4, 7, '300g'),
(5, 8, '200g');

INSERT INTO masterclasses (title, date_time, chef_id) VALUES
('Mastering French Cuisine', '2025-04-01 18:00:00', 1),
('Italian Pasta Workshop', '2025-04-05 19:00:00', 2),
('The Art of French Stews', '2025-04-10 17:00:00', 3),
('Fusion Cooking Techniques', '2025-04-15 20:00:00', 4),
('Decadent Desserts', '2025-04-20 18:30:00', 5),
('Exploring Global Cuisine', '2025-04-25 19:00:00', 6),
('Farm-to-Table Cooking', '2025-05-01 17:30:00', 7),
('Modern Italian Cuisine', '2025-05-05 18:00:00', 8),
('Molecular Gastronomy', '2025-05-10 19:00:00', 9),
('Middle Eastern Flavors', '2025-05-15 20:00:00', 10);

INSERT INTO registrations (user_id, masterclass_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);