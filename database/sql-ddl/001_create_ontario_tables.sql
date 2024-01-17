-- Create the 'connections' database
CREATE DATABASE connections;

-- Connect to the 'connections' database
\c connections;

-- Create Ontario tables
CREATE TABLE IF NOT EXISTS ontario_mpps (
    member_id INT,
    riding_name VARCHAR(255) PRIMARY KEY,
    parliamentary_role VARCHAR(255),
    party VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    honorific VARCHAR(255),
    updated_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ontario_mpp_offices (
    office_id SERIAL PRIMARY KEY,
    riding_name VARCHAR(255) REFERENCES ontario_mpps(riding_name),
    office_type VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    province VARCHAR(255),
    postal_code VARCHAR(20),
    office_email VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(20),
    fax VARCHAR(20),
    toll_free VARCHAR(20),
    tty VARCHAR(20),
    updated_date TIMESTAMP
);
