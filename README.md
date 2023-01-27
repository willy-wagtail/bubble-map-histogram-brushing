# Bubble map with histogram brushing

This repo contains a data visualisation of migration events that resulted in missing or loss of human life. The data was sourced from the [Missing Migrant Project](https://missingmigrants.iom.int) on 9th January 2023.

The bubble map visualises migration events that had someone die or go missing and their geographical locations. Each bubble represents one migration event and the radius of the bubble is proportional to the number of people missing or dead for that one event. The areas with the deepest colours are the areas with the most migration events that had someone die or go missing.

The historgram shows the total number of people missing or dead during migrations aggregated by month. Brush the histogram to select a date range.

Tech used: react (and create-react-app), d3, topojson, geojson, and Github gist.

# Bubble map notes

https://www.youtube.com/watch?v=2LhoCfjm8R4

https://github.com/topojson/world-atlas

https://unpkg.com/world-atlas@2.0.2/countries-50m.json

https://www.naturalearthdata.com/

https://en.wikipedia.org/wiki/GeoJSON

https://en.wikipedia.org/wiki/GeoJSON#TopoJSON

https://mapshaper.org/

Line Simplification

- Douglas-Peucker
  - removes points outwith a band
- Visvalingam
  - progressively removes points with least perceptible change.
  - may introduce intersections which needs removed

https://github.com/topojson/topojson#api-reference

- [feature](https://github.com/topojson/topojson-client/blob/master/README.md#feature) function converts a topojson to geojson feature or feature collection.
- [mesh](https://github.com/topojson/topojson-client/blob/master/README.md#mesh) function is useful for rendering strokes in complicated objects efficiently, as shared edges are only stroked once.
  - A filter can be passed to prune arcs from the mesh
  - (e.g. remove strokes from the globe that borders the sea but keep those that border another country).

d3

- [projections](https://github.com/d3/d3-geo/blob/v3.1.0/README.md#projections)
  - e.g. geoEqualEarth, geoNaturalEarth1
  - can take a longitude, latitude array in degrees and returns in pixels the x, y coordinates as an array.
- [geoPath](https://github.com/d3/d3-geo/blob/v3.1.0/README.md#geoPath) creates a geographic path generator. Can specify a projection and context.
- [geoGraticule](https://github.com/d3/d3-geo/blob/v3.1.0/README.md#geoGraticule) creates longitude and latitude line geometries
- [scaleSqrt](https://github.com/d3/d3-scale/blob/v4.0.2/README.md#scaleSqrt)
  - creates a new 0.5-power scale with passed in domain and range.
  - e.g. used to map population size of a city to the size of the point on the map

https://simplemaps.com/data/world-cities

- download free version
- preprocess data and upload onto github gist
  - exclude cities smaller than 50,000
  - remove all rows except city, lat, lng, country, population

https://gist.github.com/willy-wagtail/8e035ecce41d12c98dbbdb33e42e89f4

# Histogram notes

https://www.youtube.com/watch?v=2LhoCfjm8R4

https://vizhub.com/willy-wagtail/4388fef9b53e4ae6aabec95544589096?edit=files&file=index.js

https://missingmigrants.iom.int/downloads

https://gist.github.com/willy-wagtail/9062899f427340c804262de4177050cf

https://github.com/d3/d3-time-format

https://github.com/d3/d3-time#intervals used for ranges in the x-axis (e.g. months)

https://observablehq.com/@d3/d3-bin bin generation for histograms
