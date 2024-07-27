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

/**
 * The function `customStyle` calculates various styling properties based on the features provided,
 * such as size, fill color, star fill percentage, and border style.
 * @returns The function `customStyle` returns an object with the following properties:
 * - `size`: a number representing the size of a feature
 * - `starFillPercentage`: a string containing SVG `<stop>` elements for filling stars based on a
 * percentage
 * - `fillOpacity`: a number representing the opacity of the fill color (default is 1)
 * - `borderStyle`: a string representing the border style
 */
function customStyle(feature) {
  let size, starFillPercentage, fillOpacity, fill;
  const countFeature = feature.length;

  if (countFeature <= 10) {
    size = 30;
  } else if (countFeature <= 100) {
    size = 40;
  } else if (countFeature <= 200) {
    size = 60;
  } else if (countFeature <= 500) {
    size = 70;
  } else {
    size = 80;
  }

  const incomplete = feature.find(item => item.options["completeness"] === "Tidak Lengkap")

  /* Calculating the average accuracy value based on different accuracy levels
  (10, 20, 30, 40) of features and then determining the fill color based on the average accuracy
  value. */
  const accuracuValue = {
    score25: (feature.filter(item => item.options["accuracy"] === 10).length * 25),
    score50: (feature.filter(item => item.options["accuracy"] === 20).length * 50),
    score50: (feature.filter(item => item.options["accuracy"] === 30).length * 50),
    score50: (feature.filter(item => item.options["accuracy"] === 40).length * 100),
  }
  const accuracyAverage = Object.values(accuracuValue).reduce((accumulator, currentValue) => (accumulator + currentValue), 0)/countFeature;

  if (accuracyAverage >= 0 && accuracyAverage <= 25) {
    fill = getColor("Akurasi", "Inaccurate")
  } else if (accuracyAverage > 25 && accuracyAverage <= 75) {
    fill = getColor("Akurasi", "Less accurate")
  } else if (accuracyAverage > 75 && accuracyAverage <= 100) {
    fill = getColor("Akurasi", "Accurate")
  }

  /* Calculating the star fill percentage based on the priority values of features. */
  const countAveragePriority = {
    priority1: (feature.filter(item => item.options["priority"] === "Wajib Dasar").length * 100),
    priority2: (feature.filter(item => item.options["priority"] === "Wajib Tidak Dasar").length * 80),
    priority3: (feature.filter(item => item.options["priority"] === "Tidak Wajib dan Tidak Dasar").length * 60),
    // priority4: (feature.filter(item => item.options["priority"] === "Lengkap dan Tidak Akurat").length * 40),
    // priority5: (feature.filter(item => item.options["priority"] === "Tidak Lengkap").length * 20),
  }
  const starPercentage = Object.values(countAveragePriority).reduce((accumulator, currentValue) => (accumulator + currentValue), 0)/countFeature;

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

  /* The `return` statement in the `customStyle` function is creating and returning an object with
  several properties based on the calculations and conditions within the function. */
  return {
    size: size,
    starFillPercentage: starFillPercentage,
    fillOpacity: fillOpacity || 1,
    borderStyle: incomplete ? "dashed" : "solid",
    fill: fill,
    borderColor: "black",
    borderWidth: 2,
  }
}

/**
 * The `DonutCluster` function in JavaScript React sets up a map with layers for displaying
 * completeness and duplicate data, along with legends and markers.
 * @returns The `DonutCluster` function is returning `null`.
 */
function DonutCluster() {
  const data = useContext(contextData);
  const map = useMap();
  
  const duplicatedData = L.layerGroup();
  const filteredCompleteness = L.layerGroup();

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
  
  /* The `useEffect` hook in the provided is responsible for setting up and managing side
  effects in the `DonutCluster` component. */
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