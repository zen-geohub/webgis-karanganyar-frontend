import { Button, Card } from "react-bootstrap";
import BarChart from "./BarChart";
import { BsArrowsAngleExpand, } from "react-icons/bs";

function CompletenessLegend({ value, setValue}) {
  return (
    <Card style={{ width: "20%", position: "relative"}}>
      <Button onClick={() => setValue(!value)} variant="ligth" size="xs" className="position-absolute top-0 end-0"><BsArrowsAngleExpand/></Button>
      <Card.Subtitle className="pt-2 text-center">Completeness</Card.Subtitle>
      <Card.Body className="p-1">
        <BarChart />
      </Card.Body>
    </Card>
  )
}

export default CompletenessLegend;