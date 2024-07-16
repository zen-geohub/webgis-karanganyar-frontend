import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillHouseFill, BsFillGridFill, BsFileEarmarkFill } from "react-icons/bs";

function NavbarComponent({ active }) {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="w-fit p-2 d-flex flex-column justify-content-center"
    >
      {/* <Navbar.Brand href="/">
        Dashboard
      </Navbar.Brand> */}
      <Navbar.Toggle />
      <Navbar.Collapse className="p-2 flex-column gap-2">
        {/* <Nav.Item>
          <Nav.Link as={Link} to={"/"}>
            <Button
              // {...active === "/" ? variant="light" : variant="dark"}
              variant="dark"
              className="d-flex align-items-center gap-2"
              style={{ minWidth: "126px" }}
              
            >
              <BsFillHouseFill />
              Beranda
            </Button>
          </Nav.Link>
        </Nav.Item> */}
        <Nav.Item>
          <Nav.Link as={Link} to={"/dashboard"}>
            <Button
              variant={active === "/dashboard" ? "light" : "dark"}
              className="d-flex align-items-center gap-1"
              style={{ minWidth: "126px" }}
            >
              <BsFillGridFill />
              Dashboard
            </Button>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={"/application"}>
            <Button
              variant={active === "/application" ? "light" : "dark"}
              className="d-flex align-items-center gap-2"
              style={{ minWidth: "126px" }}
            >
              <BsFileEarmarkFill />
              Usulan
            </Button>
          </Nav.Link>
        </Nav.Item>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
