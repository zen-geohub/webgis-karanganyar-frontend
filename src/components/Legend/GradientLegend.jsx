import { Card } from "react-bootstrap";
import Gradient from "./Gradient";

function GradientLegend({ cardWidth, cardSubtitle, gradientWidth, legendType, legendData }) {
  return (
    <>
      <Card style={{width: cardWidth}}>
        <Card.Subtitle className="pt-2 text-center">{cardSubtitle}</Card.Subtitle>
        <Card.Body className="p-1 d-flex">
          <div style={{width: gradientWidth}}>
            <Gradient legendType={legendType} />
          </div>
          <div style={{padding: "8px 0 8px 0", width: "100%", fontSize: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            {Object.entries(legendData).map(([key, value]) => {
              return (
                <div key={key} className="d-flex align-items-center gap-2">
                  <span className="d-inline-block" style={{width: "16px", height: "16px", background: value}}></span>{key}
                </div>
              )
            })}
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default GradientLegend;