async function getGridIds(minLat, minLon, maxLat, maxLon) {
  const res = await fetch('http://localhost:5000/graphql', {
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    referrer: 'http://localhost:3000/',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: `{"query":"query gridIds($minLat: Float, $minLon: Float, $maxLat: Float, $maxLon: Float) { gridIds: gridIdsByBbox(minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) { edges { node { gridId lat lon point } }}}","variables":{"minLat":${minLat},"minLon":${minLon},"maxLat":${maxLat},"maxLon":${maxLon}},"operationName":"gridIds"}`,
    method: 'POST',
    mode: 'cors',
  });

  return (await res.json()).data.gridIds.edges.map(node => ({ ...node.node }));
}
