require 'rubygems'
require 'digest'
require 'csv'

File.open("./paul.csv") do |f|
  f.each_line do |tsv|
    tsv.chomp!
    tmp_screenshot_path = "./paul-thumbs/#{Digest::MD5.hexdigest(tsv)}"
    `phantomjs screenshot.js "http://www.gov.uk#{tsv}" 1024 768 "#{tmp_screenshot_path}.png"`
    puts '.'
  end
end

CSV.open("./paul-index.csv", "w") do |csv|
  File.open("./paul.csv") do |f|
    f.each_line do |tsv|
      tsv.chomp!
      csv << [ tsv, "#{Digest::MD5.hexdigest(tsv)}.png"]
    end
  end
end
