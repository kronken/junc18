const init = async () => {
  const params = {
    hour: 0,
    airTemperature: 0,
    windSpeed: 0,
    weekday: 0,
  };

  const paramsToApiParams = {
    hour: 'Hour',
    airTemperature: 'Air_temperature_degC',
    windSpeed: 'Wind_speed_ms',
    weekday: 'Weekdays',
  };


  const gridMapping = await getGridIds(60.143151, 24.849090, 60.196769, 24.987238);

  var heatMapCfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    radius: 0.006,
    maxOpacity: 0.4,
    // scales the radius based on map zoom
    scaleRadius: true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    useLocalExtrema: false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count',
  };

  var mymap = L.map('mapid').setView([60.1629, 24.9324], 14);

  L.tileLayer(
    'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    {
      attribution: '©OpenStreetMap, ©CartoDB',
    },
  ).addTo(mymap);

  mymap.createPane('labels');

  var positronLabels = L.tileLayer(
    'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    {
      attribution: '©OpenStreetMap, ©CartoDB',
      pane: 'labels',
    },
  ).addTo(mymap);

  var heatMapLayer = new HeatmapOverlay(heatMapCfg).addTo(mymap);

  function updateHeatMap(data) {
    var newData = {
      max: 20000,
      data: [],
    };

    Object.keys(data).forEach(function(key) {
      var coord = gridMapping.find(mapping => mapping.gridId == key);

      if (!coord) return console.error("Skiipping coord:", key);

      newData.data.push({
        lat: coord.lat,
        lng: coord.lon,
        count: Math.round(data[key])
      });
    });

    heatMapLayer.setData(newData);
  }

  const updateUIValue = paramName => {
    const value = params[paramName];

    document.querySelector(
      `#${paramName}Value`,
    ).textContent = `${paramName}: ${value}`;
  };

  const performRequest = async () => {
    let body = {
      "gridIds": [],
      "params": {
        "Hour": Number(params.hour), "Weekdays": Number(params.weekday), "Air_temperature_degC": Number(params.airTemperature), "Wind_speed_ms": Number(params.windSpeed)
      }
    }

    gridMapping.forEach(element => {
      body.gridIds.push(element.gridId);
    });

    const res = await fetch('http://localhost:5001/api/estimate', {
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      referrer: 'http://localhost:3000/',
      referrerPolicy: 'no-referrer-when-downgrade',
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
    });

    const data = await res.json();

    console.log(data);

    updateHeatMap(data);
  };

  const setupSlider = paramName => {
    updateUIValue(paramName);
    const elem = document.querySelector(`#${paramName}Slider`);
    elem.value = params[paramName];

    elem.onchange = async e => {
      const value = e.currentTarget.value;
      params[paramName] = value;
      updateUIValue(paramName);
      console.log('onchange', paramName, value);

      await performRequest();
    };
  };

  const setupDropdown = paramName => {
    const elem = document.querySelector(`#${paramName}Dropdown`);

    elem.onchange = async e => {
      const value = e.currentTarget.value;
      params[paramName] = value;
      console.log('onchange', paramName, value);

      await performRequest();
    };
  };

  setupSlider('hour');
  setupSlider('airTemperature');
  setupSlider('windSpeed');

  setupDropdown('weekday');

  performRequest();
};

init();
