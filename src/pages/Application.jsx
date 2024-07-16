import { Button, Card } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import { useContext, useEffect, useState } from "react";
import ModalUsulan from "../components/ModalUsulan";
import DataTable from "react-data-table-component";
import { contextData } from "../contexts/DataContext";

function Application() {
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);

  const data = useContext(contextData)

  const handleModal = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (data.length > 0) {
      setTableData(
        data.map((feature) => {
          const value = {
            ...feature.properties,
            geometry: JSON.stringify(feature.geometry),
          };
          return value;
        })
      );
      setTableHeader(
        Object.keys(data[0].properties).map((header) => {
          return {
            name: header,
            selector: (row) => row[header],
            sortable: true,
            wrap: "false",
          };
        })
      );
      tableHeader.push({
        name: "geometry",
        selector: (row) => row.geometry,
        sortable: true,
      });
    }
  }, [data])

  return (
    <div id="wrapper" className="vh-100 vw-100 d-flex">
      <NavbarComponent active={"/application"} />
      <div className="overflow-auto w-100 p-1">
        <Card className="overflow-auto">
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Usulan</Card.Title>
            <Button variant="primary" onClick={handleModal}>
              Tambah Usulan
            </Button>
          </Card.Header>
          <Card.Body>
            {tableData.length > 0 && (
              <DataTable
                customStyles={{
                  headCells: {
                    style: {
                      backgroundColor: "#343a40",
                      color: "white",
                    }
                  },
                }}
                columns={tableHeader}
                data={tableData}
                dense
                pagination
                highlightOnHover
                fixedHeader
                fixedHeaderScrollHeight="440px"
              />
            )}
          </Card.Body>
        </Card>
      </div>
      <ModalUsulan show={show} handleModal={handleModal} />
    </div>
  );
}

export default Application;
