import { getColor } from "./createData";

const accuracyLegend = {
  "Accurate": "#3182bd",
  "Less accurate": "#9ecae1",
  "Inaccurate": "#deebf7"
}

const priorityLegend = {
  "Basic services": "#d95f0e",
  "Mandatory affairs": "#fec44f",
  "Not mandatory affairs": "#fff7bc"
}

const priorityLevels = [
  { name: "Basic services", gradient: `<linearGradient id="grad-1"><stop offset="0%" stop-color="#fff7bc"/><stop offset="50%" stop-color="#fec44f"/><stop offset="100%" stop-color="#d95f0e"/><stop offset="100%" stop-color="grey"/></linearGradient>` },
  { name: "Mandatory affairs", gradient: `<linearGradient id="grad-2"><stop offset="0%" stop-color="#fff7bc"/><stop offset="60%" stop-color="#fec44f"/><stop offset="60%" stop-color="grey"/></linearGradient>` },
  { name: "Not mandatory", gradient: `<linearGradient id="grad-3"><stop offset="33%" stop-color="#fff7bc"/><stop offset="33%" stop-color="grey"/></linearGradient>` },
];

const countLegend = {
  "Greater than 500": "16px",
  "Less than or equal to 500": "13px",
  "Less than or equal to 200": "10px",
  "Less than or equal to 100": "7px",
  "Less than or equal to 10": "4px"
}


/**
 * The function `legendComplete` creates a legend control for a map with information on data count,
 * completeness, accuracy, and priority levels.
 * @returns The `legendComplete` function is returning a Leaflet control object that represents a
 * legend with information about data count, completeness, accuracy, and priority. The legend is
 * designed with HTML elements and styles to display the information in a visually appealing way.
 */
function legendComplete() {
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend bg-light rounded p-2 user-select-none');

    const dataCount = `
      <div class="d-flex flex-column mb-2">
        <strong>Data Count</strong>
        <table>
          <thead>
            <th class="d-flex"></th>
            <th></th>
          </thead>
          <tbody>
            ${Object.entries(countLegend).map(([key, value]) => {
              return `
                <tr>
                  <td style="vertical-align: middle; text-align: center;">
                    <span class="d-inline-block rounded-circle" style="width: ${value}; height: ${value}; background: #555555;"></span>
                  </td>
                  <td>${key}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;


    const completeness = `
      <div class="d-flex flex-column mb-2">
        <strong>Completeness</strong>
        <div class="d-flex align-items-center gap-2">
          <span class="d-inline-block rounded-circle" style="width: 16px; height: 16px; border: 2px solid #000000;"></span>Complete
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="d-inline-block rounded-circle" style="width: 16px; height: 16px; border: 2px dashed #000000;"></span>Incomplete
        </div>
      </div>
    `;

    const accuracy = `
      <div class="d-flex flex-column mb-2">
        <strong>Accuracy</strong>
        ${Object.keys(accuracyLegend).map(item => `
          <div class="d-flex align-items-center gap-2">
            <span class="d-inline-block" style="width: 16px; height: 16px; background: ${getColor("Akurasi", item)};"></span>${item}
          </div>
        `).join('')}
      </div>
    `;

    const priority = `
      <div class="d-flex flex-column mb-2">
        <strong>Priority</strong>
        ${priorityLevels.map((level, index) => `
          <div class="d-flex align-items-center gap-2">
            <svg width="16px" height="16px" viewBox="0 0 32 32">
              <defs>
                ${level.gradient}
              </defs>
              <path fill="url(#grad-${index + 1})" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
                l11.547-1.2L16.026,0.6L20.388,10.918z"/>
            </svg>
            ${level.name}
          </div>
        `).join('')}
      </div>
    `;
    

    div.innerHTML = dataCount + completeness + accuracy + priority

    return div;
  }
  return legend;
}

/**
 * The function `legendMarker` creates a legend for a map marker based on a specified property, value,
 * and name.
 * @returns The function `legendMarker` is returning a Leaflet control object that displays a legend
 * with a marker representing a specific property and value. The legend is positioned at the bottom
 * right of the map and includes the specified legend name along with a colored marker based on the
 * provided property and value.
 */
function legendMarker(markerProperty, markerValue, legendName) {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'bg-light rounded p-2');

    const content = `
      <div class="d-flex align-items-center gap-2">
        <span class="d-inline-block" style="width: 16px; height: 16px; background: ${getColor(markerProperty, markerValue)};"></span>${legendName}
      </div>
    `

    div.innerHTML = content;

    return div;
  }
  return legend;
}

export { accuracyLegend, priorityLegend, legendComplete, legendMarker }