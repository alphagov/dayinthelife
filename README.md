# A Day In The Life

A space for mucking about with ways of visualising a day in the life of
GOV.UK.

## What's here?

(Others, please add to this section)

### screens/

A number of visualisations of traffic/visits to GOV.UK

- `map`: a "pebbles-in-a-pool" map
- `mosaic`: a tiled display of virtual users browsing the site
- `time-machine`: a [Time Machine][1]-like visualisation of page views

[1]: http://en.wikipedia.org/wiki/Time_Machine_(Mac_OS)

### tools/filterlogs.py

A script to partially anonymize and geocode Akamai server logs. It parses log
lines on STDIN (or from passed filenames) and emits CSV, with the following
column headings, in order:

Column      | Description
----------- | -----------
time        | Time of request
method      | HTTP method
uri         | requested URL (may be GOV.UK or assets host at the moment)
status      | HTTP response status
bytes       | response size in bytes
time_taken  | time taken to serve response (not clear if this is upstream-only)
referer     | HTTP Referer URL
uid         | a hash of (client IP, client User-Agent)
city        | city name for geocoded client IP
latitude    | latitude of geocoded client IP
longitude   | longitude of geocoded client IP

To use `filterlogs.py` you'll need to have the
[pygeoip](https://github.com/appliedsec/pygeoip) library installed, and the
MaxMind GeoLiteCity database installed in `tools/data/`.

    curl http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz | gunzip > tools/data/GeoLiteCity.dat
    pip install pygeoip
    python tools/filterlogs.py <input.log >output.csv
