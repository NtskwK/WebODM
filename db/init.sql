ALTER USER postgres PASSWORD 'postgres';
CREATE DATABASE webodm_dev;
CREATE EXTENSION plpython3u;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION postgis_tiger_geocoder;
ALTER DATABASE webodm_dev SET postgis.gdal_enabled_drivers TO 'GTiff';
ALTER DATABASE webodm_dev SET postgis.enable_outdb_rasters TO True;
