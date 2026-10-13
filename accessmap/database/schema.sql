-- PostgreSQL schema proposal for the next iteration.
-- The included MVP runs without PostgreSQL and uses in-memory demo data.

CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    address TEXT,
    category VARCHAR(80),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accessibility_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    feature VARCHAR(40) NOT NULL CHECK (feature IN ('RAMP','STEP_FREE','ACCESSIBLE_TOILET','PARKING','DOOR_WIDTH')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('YES','NO','LIMITED','UNKNOWN')),
    notes VARCHAR(500),
    reporter_name VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_accessibility_reports_place_id ON accessibility_reports(place_id);
CREATE INDEX idx_places_name ON places(name);
