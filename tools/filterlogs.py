#!/usr/bin/env python

from __future__ import print_function

from collections import namedtuple
import csv
import fileinput
import hashlib
import logging
import os
import re
import socket
import struct
import sys

import pygeoip

LOG_FORMAT = '%(asctime)-15s %(levelname)-6s %(message)s'
logging.basicConfig(format=LOG_FORMAT, level=logging.DEBUG)
log = logging.getLogger(__name__)

HERE = os.path.dirname(__file__)

BOTS_RE = re.compile(r'libwww|curl|spider\b|Bot\b|\bbot\b|Monitage')

GEOIP_DAT = os.environ.get('GEOIP_DAT', os.path.join(HERE, 'data', 'GeoLiteCity.dat'))

LineIn = namedtuple('LineIn', 'date time ip method uri status bytes time_taken referer user_agent cookie wafinfo')
LineOut = namedtuple('LineOut', 'time method uri status bytes time_taken referer uid location lat lon')
Location = namedtuple('Location', 'name latitude longitude')

geoip = pygeoip.GeoIP(GEOIP_DAT, pygeoip.MEMORY_CACHE)

def stripcomments(fp):
    for line in fp:
        if line.startswith('#'):
            continue
        if line.strip() == '':
            continue
        yield line

def ip_to_int(val):
    try:
        _str = socket.inet_pton(socket.AF_INET, val)
    except socket.error:
        raise ValueError
    return struct.unpack('!I', _str)[0]

def make_uid(*args):
    return hashlib.sha1('::'.join(args).decode('latin1').encode('utf8')).hexdigest()

def find_location(ip):
    return geoip.record_by_addr(ip)

def process(line):
    i = LineIn(*line)

    if re.search(BOTS_RE, i.user_agent):
        return

    time = i.date + 'T' + i.time
    uid = make_uid(i.ip, i.user_agent)
    loc = find_location(i.ip)

    o = LineOut(
        time,
        i.method,
        '/' + '/'.join(i.uri.split('/')[2::]), # turn /www-origin.production.alphagov.co.uk/search/opensearch.xml into /search/opensearch.xml
        i.status,
        i.bytes,
        i.time_taken,
        i.referer,
        uid,
        loc['city'],
        loc['latitude'],
        loc['longitude']
    )

    return o


def main():
    writer = csv.writer(sys.stdout)
    fp = stripcomments(fileinput.input())
    for line in csv.reader(fp, delimiter='\t'):
        res = process(line)
        if res is not None:
            writer.writerow(res)


if __name__ == '__main__':
    main()
