import * as fs from 'fs'
import fetch from 'node-fetch'

const endPoint = 'https://sparql.crssnky.xyz/spql/imas/query'
const output = 'json'
const query = `
PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?name ?cv ?title
WHERE {
  ?s rdfs:label ?name;
    imas:cv ?cv;
    imas:Title ?title.
  FILTER (lang(?cv) = 'ja').
}
`

const fetchSPARQL = (query: string) =>
  fetch(`${endPoint}?output=${output}&query=${encodeURIComponent(query)}`)
    .then(r => r.json())
    .then(r => r.results.bindings)

// prettier-ignore
const adjustTitle = (title: string) =>
  title === 'CinderellaGirls' ? '346'   :
  title === 'MillionStars'    ? '765ML' :
  title === '315ProIdols'     ? '315'   :
  title === '283Pro'          ? '283'   :
  title === 'DearlyStars'     ? '876'   :
  title === '1054Pro'         ? '1054'  :
  title
;
;(async () => {
  const json = await fetchSPARQL(query)
  const idol = json.map(v => ({
    name: v.name.value,
    cv: v.cv.value,
    title: adjustTitle(v.title.value),
  }))
  fs.writeFileSync('im@sparql.json', JSON.stringify(idol))
  console.log('I wrote in it.')
})().catch(e => console.error(e))
