-- Connect to the 'connections' database
\c our_civic_voice;

-- Create Ontario tables
CREATE TABLE IF NOT EXISTS ontario_mpps (
  member_id INT PRIMARY KEY,
  constituency VARCHAR(255),
  parliamentary_role VARCHAR(255),
  party VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  honorific VARCHAR(255),
  updated_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ontario_mpp_offices (
  member_id INT REFERENCES ontario_mpps(member_id),
  office_id SERIAL PRIMARY KEY,
  constituency VARCHAR(255),
  office_type VARCHAR(255),
  office_address VARCHAR(255),
  office_city VARCHAR(255),
  office_province VARCHAR(255),
  office_postal_code VARCHAR(20),
  office_email VARCHAR(255),
  general_email VARCHAR(255),
  office_telephone VARCHAR(20),
  office_fax VARCHAR(20),
  office_toll_free VARCHAR(20),
  office_tty VARCHAR(20),
  updated_date TIMESTAMP
);
