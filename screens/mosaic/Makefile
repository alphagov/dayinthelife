DATE=20130107
HITS=10

all:	slots.json

slots.json:	data/slots.txt bin/slots2json.pl
	: make json with md5 hashes for urls with screenshots
	cat data/slots.txt | bin/slots2json.pl > $@

data/slots.txt:	data/ordered.txt
	: filter urls with $(HITS) or more hits
	cat data/ordered.txt  | awk '$$2 >= $(HITS) { print }' > $@

data/ordered.txt:	data/counted.txt
	: reorder columns, order by popularity within a slot
	cat data/counted.txt | awk '{ print $$2 " " $$1 " " $$3 }' | sort -n > $@

data/counted.txt:	data/logs.txt
	: count urls within a slot
	cat data/logs.txt | sort | uniq -c > $@

data/logs.txt:
	: proces a day worth of w3c format log files
	gzcat logs/*$(DATE)*.gz | awk -F'	' '{ print $$2 " " $$5 }' | sed -e 's/[0-9]:[0-9][0-9] / /' -e 's/://' -e 's/\/[^/]*//' > $@

#
#  mangle screenshots
#  TBD: 
#  - fetch screenshots
#  - script to resize
#  - check -nt
#  - fix Web fonts
#
img/thumb:
	mkdir -p $@
	cd img/full; for i in *png; do convert -define png:size=400x400 $$i -thumbnail 400x400^ -extent 400x400 ../thumbs/$$i; done

img/small:
	mkdir -p $@
	cd img/thumb ; for i in *png; do convert -define png:size=25x25 $$i -thumbnail 25x25^ -extent 25x25 ../small/$$i; done

clean::
	rm -f images.html

prune:
	rm -f data/*



# hacks
images.html:	slots.json
	: make html div of images for experiments
	cat slots.json | sed -e 's/"//g' -e 's/:.*$$//' -e '/^[{}]/d' -e 's/^/<img src="/' -e 's/$$/.png">/' | sort | uniq  > $@
