CREATE OR REPLACE FUNCTION refresh_all_representatives()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW all_representatives;
END;
$$;

