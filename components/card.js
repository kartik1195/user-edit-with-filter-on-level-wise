import {Card} from 'react-bootstrap';

const CardLayout = (props)=>{
    return <>
        <Card bg="light" text='dark' style={{ width: '18rem' }} className="mb-2">
            <Card.Header className="text-center">Total {props.forName} {props.filterOnLevel!=='' && "on level "+ (parseInt(props.filterOnLevel)+1)}</Card.Header>
            <Card.Body className="text-center">
                <Card.Title>{props.toalDataOnLevel>0 ? "Total "+props.forName+ " is \n"+props.toalDataOnLevel: "Data not found"}</Card.Title>
            </Card.Body>
        </Card>
    </>
}
export default CardLayout