-- Create the 'connections' database
CREATE DATABASE connections;

-- Connect to the 'connections' database
\c connections;

-- Drop the tables if they exist
DROP TABLE IF EXISTS ontario_mpp_offices;
DROP TABLE IF EXISTS ontario_mpp;

-- Create Ontario tables
CREATE TABLE IF NOT EXISTS ontario_mpp (
    member_id INT PRIMARY KEY,
    riding_name VARCHAR(255),
    parliamentary_role VARCHAR(255),
    party VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    honorific VARCHAR(255),
    active BOOLEAN,
    updated_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ontario_mpp_offices (
    office_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES ontario_mpp(member_id),
    office_type VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    province VARCHAR(255),
    postal_code VARCHAR(10),
    office_email VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(20),
    fax VARCHAR(20),
    toll_free VARCHAR(20),
    tty VARCHAR(20),
    active BOOLEAN,
    updated_date TIMESTAMP
);
