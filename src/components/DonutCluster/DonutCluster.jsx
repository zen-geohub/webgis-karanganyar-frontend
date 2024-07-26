import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "../../utils/Leaflet.DonutCluster.js";
import "../../utils/Leaflet.DonutCluster.css";
import "beautifymarker/leaflet-beautify-marker-icon.js";
import "beautifymarker/leaflet-beautify-marker-icon.css";
import "@fortawesome/fontawesome-free/css/all.css"
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import { useEffect, useContext } from "react";
import { contextData } from "../../contexts/DataContext.jsx";
import { getColor, createFeatureNonPoint, createMarker } from "./createData.js";
import { legendComplete, legendMarker } from "./createLegend.jsx";

function DonutCluster() {
  const data = useContext(contextData);
  const map = useMap();
  
  const duplicatedData = L.layerGroup();
  const filteredCompleteness = L.layerGroup();

  function customStyle(feature) {
    let size, starFillPercentage, fillOpacity, fill, borderStyle;
    
    // const countAccuracyTotal = feature.length * 40;
    // const countAverageAccuracy = {
    //   score10: (feature.filter(item => item.options["accuracy"] === 10).length * 10) / countAccuracyTotal,
    //   score20: (feature.filter(item => item.options["accuracy"] === 20).length * 20) / countAccuracyTotal,
    //   score30: (feature.filter(item => item.options["accuracy"] === 30).length * 30) / countAccuracyTotal,
    //   score40: (feature.filter(item => item.options["accuracy"] === 40).length * 40) / countAccuracyTotal,
    //   // total: feature.length,
    // }

    const countAccuracyTotal = feature.length
    const countAverageAccuracy = {
      score25: (feature.filter(item => item.options["accuracy"] === 10).length * 25),
      score50: (feature.filter(item => item.options["accuracy"] === 20).length * 50),
      score50: (feature.filter(item => item.options["accuracy"] === 30).length * 50),
      score50: (feature.filter(item => item.options["accuracy"] === 40).length * 100),
    }
    // console.log(countAverageAccuracy)
    const accuracyReducer = Object.values(countAverageAccuracy).reduce((a, b) => (a + b), 0)/countAccuracyTotal;
    // console.log(accuracyReducer);

    if (accuracyReducer >= 0 && accuracyReducer <= 33) {
      fill = getColor("Akurasi", "Inaccurate")
    } else if (accuracyReducer > 33 && accuracyReducer <= 66) {
      fill = getColor("Akurasi", "Less accurate")
    } else if (accuracyReducer > 66 && accuracyReducer <= 100) {
      fill = getColor("Akurasi", "Accurate")
    }

    const countPriorityTotal = feature.length;
    const countAveragePriority = {
      priority1: (feature.filter(item => item.options["priority"] === "Wajib Dasar").length * 100),
      priority2: (feature.filter(item => item.options["priority"] === "Wajib Tidak Dasar").length * 80),
      priority3: (feature.filter(item => item.options["priority"] === "Tidak Wajib dan Tidak Dasar").length * 60),
      // priority4: (feature.filter(item => item.options["priority"] === "Lengkap dan Tidak Akurat").length * 40),
      // priority5: (feature.filter(item => item.options["priority"] === "Tidak Lengkap").length * 20),
      // total: feature.length,
    }

    let starPercentage = Object.values(countAveragePriority).reduce((a, b) => (a + b), 0)/countAccuracyTotal;

    if (starPercentage <= 33) {
      starFillPercentage = `
        <stop offset=${starPercentage}% stop-color="#fff7bc"/>
        <stop offset=${starPercentage}% stop-color="grey"/>
      `
    } else if (starPercentage <= 66) {
      starFillPercentage = `
        <stop offset=0% stop-color="#fff7bc"/>
        <stop offset=${starPercentage}% stop-color="#fec44f"/>
        <stop offset=${starPercentage}% stop-color="grey"/>
      `
    } else {
      starFillPercentage = `
        <stop offset=0% stop-color="#fff7bc"/>
        <stop offset=50% stop-color="#fec44f"/>
        <stop offset=${starPercentage}% stop-color="#d95f0e"/>
        <stop offset=${starPercentage}% stop-color="grey"/>
      `
    }
    // console.log(starFillPercentage);
    // console.log(countAveragePriority);
    // console.log(countTotal);
    // console.log(Object.values(countAveragePriority).reduce((a, b) => a + b, 0));

    // console.log(countPercentage);

    const incomplete = feature.find(item => item.options["completeness"] === "Tidak Lengkap")
    borderStyle = incomplete ? "dashed" : "solid";

    if (feature.length <= 10) {
      size = 30;
    } else if (feature.length <= 100) {
      size = 40;
    } else if (feature.length <= 200) {
      size = 60;
    } else if (feature.length <= 500) {
      size = 70;
    } else {
      size = 80;
    }

    return {
      size: size,
      starFillPercentage: starFillPercentage,
      fillOpacity: fillOpacity || 1,
      borderStyle: borderStyle,
      fill: fill,
      borderColor: "black",
      borderWidth: 2,
    }
  }

  const clusterCompleteness = L.DonutCluster(
    { chunkedLoading: true },
    { style: function(feature) { return customStyle(feature) }}
  );

  const completenessLegend = legendComplete()
  const duplicateLegend = legendMarker('Rangkap', 'Data Rangkap', 'Duplicate Data')
  const nonDuplicateLegend = legendMarker('Rangkap', 'Tidak Rangkap', 'Non-duplicate Data')
  
  function updateLegend() {
    const legends = [
      { layer: clusterCompleteness, legend: completenessLegend },
      { layer: clusterCompleteness, legend: nonDuplicateLegend },
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
    }).addTo(filteredCompleteness)

    createMarker(clusterCompleteness, data.filter(feature => feature.properties["Rangkap"] === "Tidak Rangkap"), "Kelengkapan");
    createFeatureNonPoint(filteredCompleteness, data.filter(feature => feature.properties["Rangkap"] === "Tidak Rangkap").filter(feature => feature.geometry.type !== 'Point'));
    
    createMarker(duplicatedData, data.filter(feature => feature.properties["Rangkap"] === "Data Rangkap"), "Rangkap", "Data Rangkap", "red");

    map.on('zoomend', function() {
      const zoomLevel = map.getZoom();

      if (zoomLevel >= 15) {
        map.hasLayer(clusterCompleteness) && map.addLayer(filteredCompleteness);
      } else {
        map.hasLayer(clusterCompleteness) && map.removeLayer(filteredCompleteness);
      }
    })

    map.on('layeradd', updateLegend)
    map.on('layerremove', updateLegend)

    const layerControl = L.control.layers(null, {
      "Duplicate Data": duplicatedData,
      "Completeness": clusterCompleteness,
    }).addTo(map)

    // Clean up function
    return () => {
      map.removeLayer(duplicatedData)
      map.removeLayer(clusterCompleteness);
      map.removeControl(layerControl);
    };
  }, [data]);

  return null;
}

export default DonutCluster;