import { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet-better-filelayer/dist/leaflet.betterfilelayer.min.js";
import DataTable from "react-data-table-component";

function ModalUsulan({ show, handleModal }) {
  const [column, setColumn] = useState();
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(
      data.map(feature => {
        const value = {
          ...feature.properties,
          geometry: JSON.stringify(feature.geometry)
        }
        return value
      })
    )
  }, [data])

  function handleSubmit() {
    data.forEach(item => {
      fetch(`${import.meta.env.VITE_BACKEND}/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    })
  }

  function handleGet() {
    fetch("http://localhost:3000/api/form", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => console.log(JSON.parse(data)))
    .catch(error => console.error('Error:', error));
  }

  function Map() {
    const map = useMap();

    L.Control.betterFileLayer({
      button: document.getElementById("inputFile"),
    }).addTo(map);

    map.on("bfl:layerloaded", function ({ layer }) {
      setData(
        Object.values(layer["_layers"]).map((layerItem) => {return layerItem.feature})
      )

      setColumn(() => {
        const column = Object.keys(
          Object.values(layer["_layers"])[0].feature.properties
        ).map((item) => {
          return { name: item, selector: row => row[item], sortable: true };
        });
        column.push({
          name: "geometry",
          selector: row => row.geometry,
          sortable: true,
          wrap: "false"
        });
        return column;
      });
    });
  }

  return (
    <Modal
      show={show}
      onHide={handleModal}
      backdrop="static"
      keyboard={false}
      size="xl"
      scrollable={true}
    >
      <Modal.Header>
        <Modal.Title>Formulir Usulan</Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <MapContainer
          center={[-6.1753924, 106.8271528]}
          zoom={13}
          style={{ height: "300px", width: "100%", borderRadius: "4px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Map />
        </MapContainer>

        <div className="w-25 mt-3">
          <Form>
            <Form.Group className="mb-3" style={{width: "100%"}}>
              <Form.Label >
                <strong>Tambahkan Data</strong>
                <p>(*.geojson, *.json, *.csv, *.shp)</p>
              </Form.Label>

              <Form.Control
                id="inputFile"
                type="file"
                accept=".geojson, .json, .csv, .shp"
              />
            </Form.Group>
          </Form>
        </div>
        {/* {test && <DataTable columns={testColumn} data={testData} />} */}
        {tableData.length > 0 && <DataTable columns={column} data={tableData} dense pagination highlightOnHover fixedHeader/>}
        {/* <DataTable columns={data.length > 0 ? Object.keys(data[0]).map(item => ({name: item, selector: item})) : []} data={data} /> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModal}>
          Batalkan
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUsulan;