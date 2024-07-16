import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "@kalisio/leaflet.donutcluster/src/Leaflet.DonutCluster.js";
import "@kalisio/leaflet.donutcluster/src/Leaflet.DonutCluster.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.js";
import "@fortawesome/fontawesome-free/css/all.css"
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import { useEffect, useContext } from "react";
import { contextData } from "../contexts/DataContext";

function getColor(markerProperty, markerValue) {
  const colorCategory = {
    "Kelengkapan": {
      "Lengkap": "green",
      "Tidak Lengkap": "black",
    },
    "Akurasi Alamat dan Wewenang OPD": {
      "Akurat": "green",
      "Tidak Akurat": "black",
    },
    "Prioritas": {
      "Tidak Wajib dan Tidak Dasar": "blue",
      "Wajib Tidak Dasar": "cadetblue",
      "Wajib Dasar": "black",
    },
    "Rangkap": {
      "Data Rangkap": "red",
      "Tidak Rangkap": "black",
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
      "RUANG PUBLIK": "tree", // Example icon for public space
      SALURAN: "water", // Example icon for channel/drainage
      JEMBATAN: "bridge" // Example icon for bridge
  };

  return iconCategory[category] || "question";
}

function createMarker(layerGroup, data, markerProperty) {
  L.geoJSON(data, {
    onEachFeature: function (feature) {
      L.marker([feature.properties["Lat"], feature.properties["Long"]], {
        title: feature.properties[markerProperty],
        icon: L.AwesomeMarkers.icon({
          icon: getIcon(feature.properties["Kategori"]),
          markerColor: getColor(markerProperty, feature.properties[markerProperty]),
          prefix: "fa",
        }),
      }).bindPopup(
        Object.entries(feature.properties)
          .map(([key, value]) => {
            return `<b>${key}</b>: ${value}`;
          }
        ).join("<br>")
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

function createLegend(title, categories, colors) {
  const legend = L.control({ position: "bottomleft" })
  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend bg-light rounded p-2");
    const labels = [`<strong>${title}</strong>`];

    for (let i = 0; i < categories.length; i++) {
      labels.push(
        '<i class="" style="background:' + colors[i] + '"></i> ' +
        (categories[i] ? categories[i] : '+')
      );
    }

    div.innerHTML = labels.join('<br>');
    return div;
  }
  return legend
}

function DonutCluster() {
  const data = useContext(contextData);
  const map = useMap();

  const akurasi = data.filter(feature => feature.properties["Kelengkapan"] === "Lengkap");
  const prioritas = data.filter(feature => feature.properties["Kelengkapan"] === "Lengkap" && feature.properties["Akurasi Alamat dan Wewenang OPD"] === "Akurat");
  const duplicatedData = L.layerGroup();
  const filteredCompleteness = L.layerGroup();
  const filteredAccuracy = L.layerGroup();
  const filteredPriority = L.layerGroup();

  const clusterCompleteness = L.DonutCluster(
    { chunkedLoading: true },
    {
      key: "title",
      order: ["Tidak Lengkap", "Lengkap"],
      title: ["Incomplete", "Complete"],
      arcColorDict: {
        "Tidak Lengkap": "#000000",
        "Lengkap": "#72B026",
      },
    }
  );
  const clusterAccuracy = L.DonutCluster(
    { chunkedLoading: true },
    {
      key: "title",
      order: ["Tidak Akurat", "Akurat"],
      title: ["Inaccurate", "Accurate"],
      arcColorDict: {
        "Tidak Akurat": "#000000",
        "Akurat": "#72B026",
      },
    }
  );
  const clusterPriority = L.DonutCluster(
    { chunkedLoading: true },
    {
      key: "title",
      order: ["Tidak Wajib dan Tidak Dasar", "Wajib Tidak Dasar", "Wajib Dasar"],
      title: ["Complete, Accurate, Not Priority", "Complete, Accurate, Priority 2", "Complete, Accurate, Priority 1"],
      arcColorDict: {
        "Tidak Wajib dan Tidak Dasar": "#6baed6",
        "Wajib Tidak Dasar": "#3182bd",
        "Wajib Dasar": "#08519c",
      },
    }
  );
  
  const completenessLegend = createLegend("Completeness", ["Complete", "Incomplete"], ["#72B026", "#000000"]);
  const accuracyLegend = createLegend("Accuracy", ["Accurate", "Inaccurate"], ["#72B026", "#000000"]);
  const priorityLegend = createLegend("Priority", ["Complete, Accurate, Priority 1", "Complete, Accurate, Priority 2", "Complete, Accurate, Not Priority"], ["#08519c", "#3182bd", "#6baed6"]);
  const duplicateLegend = createLegend("Duplicate Data", ["Duplicate Data"], ["red"]);
  
  function updateLegend() {
    const legends = [
      { layer: clusterCompleteness, legend: completenessLegend },
      { layer: clusterAccuracy, legend: accuracyLegend },
      { layer: clusterPriority, legend: priorityLegend },
      { layer: duplicatedData, legend: duplicateLegend },
    ];
  
    legends.forEach(({ layer, legend }) => {
      if (map.hasLayer(layer)) {
        map.addControl(legend);
      } else {
        map.removeControl(legend);
      }
    });
  }
  
  useEffect(() => {
    L.tileLayer.wms(`${import.meta.env.VITE_GEOSERVER}/wms`, {
      layers: 'ppids:jalan_poi',
      format: 'image/png',
      transparent: true,
    }).addTo(filteredAccuracy)

    createMarker(clusterCompleteness, data, "Kelengkapan");
    createFeatureNonPoint(filteredCompleteness, data.filter(feature => feature.geometry.type !== 'Point'));
    
    createMarker(clusterAccuracy, akurasi, "Akurasi Alamat dan Wewenang OPD");
    createFeatureNonPoint(filteredAccuracy, akurasi.filter(feature => feature.geometry.type !== 'Point'));
    
    createMarker(clusterPriority, prioritas, "Prioritas");
    createFeatureNonPoint(filteredPriority, prioritas.filter(feature => feature.geometry.type !== 'Point'));

    createMarker(duplicatedData, data.filter(feature => feature.properties["Rangkap"] === "Data Rangkap"), "Rangkap", "Data Rangkap", "red");

    map.on('zoomend', function() {
      const zoomLevel = map.getZoom();

      if (zoomLevel >= 15) {
        map.hasLayer(clusterCompleteness) && map.addLayer(filteredCompleteness);
        map.hasLayer(clusterAccuracy) && map.addLayer(filteredAccuracy);
        map.hasLayer(clusterPriority) && map.addLayer(filteredPriority);
      } else {
        map.hasLayer(clusterCompleteness) && map.removeLayer(filteredCompleteness);
        map.hasLayer(clusterAccuracy) && map.removeLayer(filteredAccuracy);
        map.hasLayer(clusterPriority) && map.removeLayer(filteredPriority);
      }
    })

    map.on('layeradd', updateLegend)
    map.on('layerremove', updateLegend)

    const layerControl = L.control.layers(null, {
      "Duplicate Data": duplicatedData,
      "Completeness": clusterCompleteness,
      "Accuracy": clusterAccuracy,
      "Quality": clusterPriority,
    }).addTo(map)
  
    // Clean up function
    return () => {
      map.removeLayer(duplicatedData)
      map.removeLayer(clusterCompleteness);
      map.removeLayer(clusterAccuracy);
      map.removeLayer(clusterPriority);
      map.removeControl(layerControl);
    };
  }, [data]);

  return null;
}

export default DonutCluster;