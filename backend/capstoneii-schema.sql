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
    from_date date,
    to_date date,
    user_username text NOT NULL REFERENCES users ON DELETE CASCADE -- Ensures deletion of trips when user is deleted
);

CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    address text,
    loc_long DECIMAL,
    loc_lat DECIMAL,
    time_of_day time without time zone NOT NULL,
    time_to_visit DECIMAL
);

-- Create the junction table for many-to-many relationship
CREATE TABLE trips_places (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    place_id INTEGER REFERENCES places(id) ON DELETE CASCADE
);