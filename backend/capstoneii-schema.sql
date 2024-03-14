CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    email text NOT NULL UNIQUE,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    location_name text NOT NULL,
    loc_long DECIMAL,
    loc_lat DECIMAL, 
    from_date date NOT NULL,
    to_date date NOT NULL,
    user_username text NOT NULL REFERENCES users ON DELETE CASCADE -- Ensures deletion of trips when user is deleted
);

CREATE TABLE days (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    trip_id INTEGER NOT NULL REFERENCES trips ON DELETE CASCADE
);

CREATE TABLE places (
    id text PRIMARY KEY,
    name text NOT NULL,
    address text,
    loc_long DECIMAL,
    loc_lat DECIMAL,
    category text[]
    
);

-- Create the junction table for many-to-many relationship
CREATE TABLE trips_places (
    id SERIAL PRIMARY KEY,
    day_id INTEGER REFERENCES days(id) ON DELETE CASCADE,
    place_id text REFERENCES places(id) ON DELETE CASCADE,
    time_of_day time without time zone NOT NULL,
    time_to_visit DECIMAL
);

ALTER TABLE trips_places ADD CONSTRAINT unique_place_day UNIQUE (place_id, day_id);