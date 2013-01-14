use Rack::Static,
  :urls => ["/data", "/javascripts", "/stylesheets"]

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('journeys.html', File::RDONLY)
  ]
}
