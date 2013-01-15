#!/usr/bin/env perl

use strict;

use Digest::MD5 qw(md5_hex);

my $cslot;
my $csep = "";
my $sep = "";

print '{"slots":[' . "\n";

while (<>) {
	chomp;
	my ($slot, $count, $path) = split(/\s/);
	my $hash = md5_hex($path);

	# skip where there's no screenshot ..
	next unless -e "img/full/$hash.png";

	if ($cslot ne $slot) {
	   print $csep . '{ "time":"' . $slot . '0","hits":{';
	   $cslot = $slot;
	   $csep = "}},\n";
	   $sep = "\n"
	}

	print $sep . '"' . $hash . '":' . $count;
	$sep = ",\n";
}

print "}}]}\n";
