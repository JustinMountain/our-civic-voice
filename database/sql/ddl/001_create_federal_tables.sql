-- Connect to the 'connections' database
\c our_civic_voice;

-- Create Federal tables
CREATE TABLE IF NOT EXISTS federal_mps (
  member_id INT PRIMARY KEY,
  honorific VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  constituency VARCHAR(255),
  province_territory VARCHAR(255),
  party VARCHAR(255),
  active_from VARCHAR(255),
  updated_date TIMESTAMP,
  source VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS federal_mp_offices (
  member_id INT REFERENCES federal_mps(member_id),
  office_id SERIAL PRIMARY KEY,
  general_email VARCHAR(255),
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



-- Create Federal tables
CREATE TABLE IF NOT EXISTS federal_reps (
  member_id INT PRIMARY KEY,
  time_retrieved TIMESTAMP,
  honorific VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  constituency VARCHAR(255),
  province_territory VARCHAR(255),
  party VARCHAR(255),
  email VARCHAR(255),
  website VARCHAR(255),
  image_url VARCHAR(255),
  source_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS federal_offices (
  member_id INT REFERENCES federal_reps(member_id),
  office_id SERIAL PRIMARY KEY,
  time_retrieved TIMESTAMP,
  office_type VARCHAR(255),
  office_title VARCHAR(255),
  office_address VARCHAR(255),
  office_city VARCHAR(255),
  office_province VARCHAR(255),
  office_postal_code VARCHAR(255),
  office_note VARCHAR(255),
  office_telephone VARCHAR(255),
  office_fax VARCHAR(255),
  office_email VARCHAR(255),
  office_toll_free VARCHAR(255),
  office_tty VARCHAR(255),
  source_url VARCHAR(255)
);
