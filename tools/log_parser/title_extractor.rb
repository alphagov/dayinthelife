require 'open-uri'
require 'redis'

class TitleExtractor

  TITLE_REGEXP = /<title>([^<]+)<\/title>/

  def initialize(redis_options={})
    @redis = Redis.new(redis_options)

  end

  def get_title(url)
    return nil if url.match(/\.(pdf|xml|json|ics|atom|xls|zip|xml|doc|css|ico|js)/)
    title = @redis.get("urls:#{url}")
    unless title
      puts "getting title for #{url}"
      begin
        page_contents = open(url){ |f| f.read }
      rescue
        return nil
      end
      matches = page_contents.match(TITLE_REGEXP)
      if matches
        title = matches[1]
        @redis.set("urls:#{url}", title)
      else
        return nil
      end
    end
    title
  end
end
