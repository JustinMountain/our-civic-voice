-- Connect to the 'connections' database
\c our_civic_voice;

-- Create Federal tables
CREATE TABLE IF NOT EXISTS federal_mps (
    honorific VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    constituency VARCHAR(255) PRIMARY KEY,
    province_territory VARCHAR(255),
    party VARCHAR(255),
    active_from VARCHAR(255),
    updated_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS federal_mp_offices (
    office_id SERIAL PRIMARY KEY,
    constituency VARCHAR(255) REFERENCES federal_mps(constituency),
    email VARCHAR(255),
    website VARCHAR(255),
    office_type VARCHAR(255),
    office_title VARCHAR(255),
    office_address VARCHAR(255),
    office_city VARCHAR(255),
    office_province VARCHAR(255),
    office_postal_code VARCHAR(255),
    office_note VARCHAR(255),
    office_telephone VARCHAR(255),
    office_fax VARCHAR(255),
    source VARCHAR(255),
    updated_date TIMESTAMP
);
