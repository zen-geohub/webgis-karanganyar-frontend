/**
 * The function `getColor` returns a color based on the provided marker property and value from a
 * predefined color category object.
 * @param markerProperty - MarkerProperty is the category of the marker, such as "Kelengkapan",
 * "Akurasi", or "Rangkap".
 * @param markerValue - Marker value is the specific value of a marker property that you want to get
 * the color for.
 * @returns The function `getColor` returns the color value associated with the given `markerProperty`
 * and `markerValue` from the `colorCategory` object. If there is no matching color value found, it
 * returns "black" as the default color.
 */
function getColor(markerProperty, markerValue) {
  const colorCategory = {
    "Kelengkapan": {
      "Lengkap": "#31a354",
      "Tidak Lengkap": "#a1d99b",
    },
    "Akurasi": {
      "Inaccurate": "#deebf7",
      "Less accurate": "#9ecae1",
      "Accurate": "#3182bd",
    },
    "Rangkap": {
      "Data Rangkap": "#de2d26",
      "Tidak Rangkap": "#31a354",
    }
  }

  return colorCategory[markerProperty][markerValue] || "black";
}

/**
 * The function `getIcon` takes a category as input and returns the corresponding icon name from a
 * predefined mapping object, defaulting to "question" if no match is found.
 * @param category - The `getIcon` function takes a `category` parameter as input. This parameter
 * represents a category related to infrastructure such as roads, buildings, water, bridges, etc. The
 * function then returns the corresponding icon name based on the category provided. If the category is
 * not found in the predefined mapping,
 * @returns The function `getIcon` returns the icon corresponding to the provided `category` parameter.
 * If the `category` matches one of the keys in the `iconCategory` object, it returns the corresponding
 * icon value. If the `category` does not match any key in the object, it returns "question" as the
 * default icon.
 */
function getIcon(category) {
  const iconCategory = {
    JALAN: "road",
    TALUD: "bars",
    "AIR & SANITASI": "hand-holding-water",
    GEDUNG: "building",
    "RUANG PUBLIK": "tree",
    SALURAN: "water",
    JEMBATAN: "bridge"
  };

  return iconCategory[category] || "question";
}

/**
 * The function `createMarker` generates markers on a Leaflet map based on GeoJSON data with
 * customizable properties and popups.
 * @param layerGroup - The `layerGroup` parameter in the `createMarker` function is a reference to a
 * Leaflet layer group where the markers will be added. This allows you to organize and manage multiple
 * markers on the map by adding them to the same layer group.
 * @param data - The `data` parameter in the `createMarker` function is a GeoJSON object that contains
 * the geographical data for creating markers on a map. It typically includes features with properties
 * such as latitude, longitude, accuracy, priority, completeness, category, and other relevant
 * information for each marker.
 * @param markerProperty - The `markerProperty` parameter in the `createMarker` function is used to
 * specify the property of the feature data that will be used to determine the color of the marker
 * icon. This property is passed to the `getColor` function along with the corresponding value from the
 * feature properties to get the appropriate color
 */
function createMarker(layerGroup, data, markerProperty) {
  L.geoJSON(data, {
    onEachFeature: function (feature) {
      L.marker([feature.properties["Lat"], feature.properties["Long"]], {
        accuracy: feature.properties["Skor Akurasi"],
        priority: feature.properties["Prioritas"],
        completeness: feature.properties["Kelengkapan"],
        icon: L.BeautifyIcon.icon({
          icon: getIcon(feature.properties["Kategori"]),
          iconShape: "marker",
          borderColor: getColor(markerProperty, feature.properties[markerProperty]),
          backgroundColor: getColor(markerProperty, feature.properties[markerProperty]),
          textColor: "white",
        })
      }).bindPopup(
        Object.entries(feature.properties)
          .map(([key, value]) => {
            return `<b>${key}</b>: ${value}`;
          }
        ).join("<br>"), { maxHeight: 200 }
      ).addTo(layerGroup);
    }
  })
}

/**
 * The function `createFeatureNonPoint` creates a Leaflet GeoJSON layer with popups for each feature in
 * the provided data.
 * @param layerGroup - The `layerGroup` parameter is typically a `L.LayerGroup` object in Leaflet,
 * which is used to group layers together and handle them as a single unit on the map. This allows you
 * to add or remove multiple layers at once, making it easier to manage and control the display of
 * multiple
 * @param data - The `data` parameter in the `createFeatureNonPoint` function is the GeoJSON data that
 * you want to display on the map. It contains the geographical features and their properties that you
 * want to visualize. This data can include information such as polygons, lines, or other non-point
 * features with associated
 */
function createFeatureNonPoint(layerGroup, data) {
  L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        Object.entries(feature.properties)
          .map(([key, value]) => {
            return `<b>${key}</b>: ${value}`;
          })
          .join("<br>")
      ).addTo(layerGroup);
    }
  })
}

export { getColor, createMarker, createFeatureNonPoint }