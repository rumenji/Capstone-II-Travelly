\echo 'Delete and recreate Capstone II db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE capstoneii;
CREATE DATABASE capstoneii;
\connect capstoneii

\i capstoneii-schema.sql

\echo 'Delete and recreate capstoneii_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE capstoneii_test;
CREATE DATABASE capstoneii_test;
\connect capstoneii_test

\i capstoneii-schema.sql