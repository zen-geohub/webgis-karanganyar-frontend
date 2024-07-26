import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Button, Modal } from "react-bootstrap";
import { BsArrowsAngleContract } from "react-icons/bs";
import NavbarComponent from "../components/NavbarComponent";
import DonutCluster from "../components/DonutCluster/DonutCluster";
import BarChart from "../components/Legend/BarChart";
import GradientLegend from "../components/Legend/GradientLegend";
import PriorityLegend from "../components/Legend/PriorityLegend";
import CompletenessLegend from "../components/Legend/CompletenessLegend";
import { accuracyLegend, priorityLegend } from "../components/DonutCluster/createLegend";

function Dashboard() {
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
            <MapContainer
              center={[-7.581469, 110.94525]}
              zoom={12}
              maxZoom={20}
              style={{ height: "63%", width: "100%", borderRadius: "4px" }}
              attributionControl={false}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <DonutCluster />
              <Border />
            </MapContainer>
          <div className="d-flex gap-2 mt-2">
            <CompletenessLegend value={showBar} setValue={setShowBar} />
            <GradientLegend cardWidth={"30%"} cardSubtitle={"Aspirations Accuracy"} gradientWidth={"50%"} legendType={"accuracy"} legendData={accuracyLegend} />
            <GradientLegend cardWidth={"30%"} cardSubtitle={"Aspirations Priority"} gradientWidth={"50%"} legendType={"priority"} legendData={priorityLegend} />
            <PriorityLegend />
          </div>
        </div>
      </div>

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