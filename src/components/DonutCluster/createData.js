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