require 'csv'
require 'sinatra'
require 'json'

require './log_parser'
require './title_extractor'

headers = %w{time method uri status bytes time_taken referer uid city lat long}
title_extractor = TitleExtractor.new
output = nil

last_time = ''
time_regexp = /^\d{4}-\d{2}-\d{2}T\d{2}\:\d/

File.foreach('../input/geo-log.log') do |l|
  line = Hash[headers.zip(l.encode('UTF-8', 'binary', :invalid => :replace, :undef => :replace).split(','))]
  line['lat'] = line['lat'].to_f
  line['long'] = line['long'].to_f

  if((line['lat'] > 49.8 and line['lat'] < 59.4) and (line['long'] > -10.53 and line['long'] < 1.8) and (line['lat'] != 54.0 and line['long'] -2.0) and line['method'] == 'GET' and line['status'] == '200')

    current_time = line['time'].match(time_regexp)[0]
    if current_time != last_time
      last_time = current_time
      if output
        output.write(']')
        output.close
      end
      output = File.open("output/#{current_time}.json", "w")
      output.write('[')
    end

    title = title_extractor.get_title("https://www.gov.uk#{line['uri']}")
    if title
      output.puts("#{JSON.generate([line['lat'], line['long'], line['city'], title])},")
    end
  end
end

