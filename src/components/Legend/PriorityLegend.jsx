import { Card } from "react-bootstrap";

function QualityLegend({ borderStyle, fillBackground, starFillPercentage, identity }) {
  const id = Math.random();

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: "32px", height: "32px", border: `2px #000000 ${borderStyle}`, padding: "2px"}}>
        <div className="rounded-circle w-100 h-100 d-flex align-items-center justify-content-center" style={{background: fillBackground}}>
          <svg width="12px" height="12px" viewBox="0 0 32 32">
            <defs>
              <linearGradient id={`grad-${id}`}>
                <stop offset={`${starFillPercentage}%`} stopColor="#fed976"/>
                <stop offset={`${starFillPercentage}%`} stopColor="grey"/>
              </linearGradient>
            </defs>
            <path fill={`url(#grad-${id})`} d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
            l11.547-1.2L16.026,0.6L20.388,10.918z"/>
          </svg>
        </div>
      </div>
      {identity}
    </div>
  )
}

function PriorityLegend() {
  return (
    <Card style={{width: "20%"}}>
      <Card.Subtitle className="p-2 text-center">Aspiration Quality</Card.Subtitle>
      <Card.Body className="d-flex flex-column justify-content-center align-items-center gap-1 p-0">
        <QualityLegend borderStyle={"solid"} fillBackground={"#2171b5"} starFillPercentage={"100"} identity={"Grade A"} />
        <QualityLegend borderStyle={"solid"} fillBackground={"#2171b5"} starFillPercentage={"60"} identity={"Grade B"}/>
        <QualityLegend borderStyle={"solid"} fillBackground={"#2171b5"} starFillPercentage={"33"} identity={"Grade C"}/>
        <QualityLegend borderStyle={"solid"} fillBackground={"#bdd7e7"} starFillPercentage={"0"} identity={"Grade D"}/>
        <QualityLegend borderStyle={"dashed"} fillBackground={"#eff3ff"} starFillPercentage={"0"} identity={"Grade E"}/>
      </Card.Body>
    </Card>
  )
}

export default PriorityLegend;