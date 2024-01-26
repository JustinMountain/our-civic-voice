CREATE MATERIALIZED VIEW all_representatives AS
  SELECT honorific, first_name, last_name, constituency, party, 'Ontario' AS province_territory, 'provincial' AS gov_level FROM ontario_mpps
  UNION
  SELECT honorific, first_name, last_name, constituency, party, province_territory, 'federal' AS gov_level FROM federal_mps;