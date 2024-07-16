import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Suspense, useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { Button, Card, Modal } from "react-bootstrap";
import DonutCluster from "../components/DonutCluster";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { BsArrowsAngleContract, BsArrowsAngleExpand, } from "react-icons/bs";

function Dashboard() {
  const [showPie, setShowPie] = useState(false);
  const [showBar, setShowBar] = useState(false);

  function Border() {
    const map = useMap();

    useEffect(() => {
      L.tileLayer.wms(`${import.meta.env.VITE_GEOSERVER}/wms`, {
        layers: 'ppids:bataskecamatan',
        format: 'image/png',
        transparent: true,
      }).addTo(map)
    }, [])
  }

  return (
    <>
      <div id="wrapper" className="vh-100 vw-100 d-flex">
        <NavbarComponent active={"/dashboard"} />
        <div className="overflow-auto w-100 p-1">
          <Suspense fallback={<div>Loading...</div>}>
            <MapContainer
              center={[-7.583469, 110.94525]}
              zoom={12}
              maxZoom={20}
              style={{ height: "70%", width: "100%", borderRadius: "4px" }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <DonutCluster />
              <Border />
            </MapContainer>
          </Suspense>
          <div className="d-flex gap-2 mt-2">
            <Card>
              <Card.Body className="d-flex justify-content-center align-items-center flex-column ">
                <h1>
                  <b>1162</b>
                </h1>
                <p className="mb-0 text-center small">Total Aspirations</p>
              </Card.Body>
            </Card>

            <Card style={{ width: "50%", position: "relative"}}>
              <Button onClick={() => setShowBar(!showBar)} variant="ligth" size="xs" className="position-absolute top-0 end-0"><BsArrowsAngleExpand/></Button>
              <Card.Body className="p-1">
                <BarChart maintainAspectRatio={false}/>
              </Card.Body>
            </Card>

            <Card style={{ width: "50%", position: "relative" }}>
              <Button onClick={() => setShowPie(!showPie)} variant="ligth" size="xs" className="position-absolute top-0 end-0"><BsArrowsAngleExpand/></Button>
              <Card.Body className="p-1">
                <PieChart maintainAspectRatio={false} legendAlign={"end"}/>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Modal show={showPie} onHide={() => setShowPie(!showPie)} centered size="lg">
        <Modal.Body>
          <Button onClick={() => setShowPie(!showPie)} variant="ligth" size="xs" className="position-absolute top-0 end-0"><BsArrowsAngleContract/></Button>
          <PieChart maintainAspectRatio={true} legendPosition={"top"}/>
        </Modal.Body>
      </Modal>
      <Modal show={showBar} onHide={() => setShowBar(!showBar)} centered size="lg">
        <Modal.Body>
          <Button onClick={() => setShowBar(!showBar)} variant="ligth" size="xs" className="position-absolute top-0 end-0"><BsArrowsAngleContract/></Button>
          <BarChart maintainAspectRatio={true}/>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Dashboard;