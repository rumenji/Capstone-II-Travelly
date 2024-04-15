DROP DATABASE capstoneii_test;
CREATE DATABASE capstoneii_test;
\connect capstoneii_test

\i capstoneii-schema.sql

-- -- Insert users
-- INSERT INTO users (username, password, first_name, last_name, email, join_at, last_login_at) 
-- VALUES ('user1', 'password1',  'John', 'Doe', 'test@test.com', '2024-06-08'::date, '2024-06-08'::date),
--        ('user2', 'password1', 'John', 'Doe', 'test1@test.com', '2024-06-08'::date, '2024-06-08'::date),
--        ('user3', 'password1', 'John', 'Doe', 'test2@test.com', '2024-06-08'::date, '2024-06-08'::date);


-- Insert trips
INSERT INTO trips (name, location_name, loc_long, loc_lat, from_date, to_date, user_username)
VALUES 
('Trip 1', 'Paris', 48.8567, 2.3508, '2020-01-01', '2020-01-05', 'user1'),
('Trip 2', 'London', 51.5074, -0.1278, '2020-02-01', '2020-02-10', 'user2'),
('Trip 3', 'New York', 40.7128, -74.0060, '2020-03-15', '2020-03-20', 'user3');

-- Insert days
INSERT INTO days (name, trip_id)
SELECT 'Day 1', id FROM trips WHERE name = 'Trip 1';
INSERT INTO days (name, trip_id)
SELECT 'Day 2', id FROM trips WHERE name = 'Trip 1';
INSERT INTO days (name, trip_id)
SELECT 'Day 1', id FROM trips WHERE name = 'Trip 2';
INSERT INTO days (name, trip_id)
SELECT 'Day 2', id FROM trips WHERE name = 'Trip 2';

-- Insert places
INSERT INTO places (id, name, address, loc_long, loc_lat, category)
VALUES 
('place1', 'Eiffel Tower', '5 Avenue Anatole France, Paris', 48.8579, 2.2946, ARRAY['Landmark']),
('place2', 'Louvre Museum', 'Rue de Rivoli, Paris', 48.8633, 2.2945, ARRAY['Museum']),
('place3', 'Big Ben', 'Westminster Bridge Road, London', 51.5007, -0.1246, ARRAY['Landmark']),
('place4', 'British Museum', 'Great Russell Street, London', 51.5194, -0.1269, ARRAY['Museum']);

-- Insert trips_places
INSERT INTO trips_places (day_id, place_id, time_of_day, time_to_visit)
SELECT d.id, p.id, '09:00:00'::time without time zone, 120 FROM days d JOIN trips t ON d.trip_id = t.id JOIN places p ON p.name = 'Eiffel Tower' WHERE t.name = 'Trip 1';
INSERT INTO trips_places (day_id, place_id, time_of_day, time_to_visit)
SELECT d.id, p.id, '11:00:00'::time without time zone, 90 FROM days d JOIN trips t ON d.trip_id = t.id JOIN places p ON p.name = 'Louvre Museum' WHERE t.name = 'Trip 1';