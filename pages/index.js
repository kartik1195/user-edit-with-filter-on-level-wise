import Users from '../files/users'
import { useEffect, useState, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Stack,  Form, Button} from 'react-bootstrap';

import CardLayout from '../components/card'

export default function Home() {
    const currLevel = useRef(null);
    let [userList,setUserList]=useState(Users)
    let [levelWiseFilter,setLevelWiseFilter]=useState([])
    let [filterValue,setFilterValue]=useState( {"user":0,"staked":0})
    let [level,setLevel]=useState(0)
    let [filterOnLevel,setFilterOnLevel]=useState('')

  useEffect(() => {
    return () => {
        let _levelWiseFilter=[]
        let levelCount=-1 // -1 used for manage indexing in recursive calling 
        let updateUserList=checkList(userList,levelCount,_levelWiseFilter) // for init with 0 level
        setUserList([...updateUserList])
        setLevel(_levelWiseFilter.length) // we will get max level in user list
        setLevelWiseFilter([..._levelWiseFilter])
    }
  }, [])

  const checkList=(userLists,levelCount,_levelWiseFilter)=>{
    levelCount++
    return userLists?.map((item) => {
        let totalStaked=item?.pools.reduce((prev,curr)=>{
            return prev+= parseFloat(curr.staked_amount)
        },0)

        if(typeof _levelWiseFilter[levelCount]!='undefined'){
           _levelWiseFilter[levelCount] = {"user":_levelWiseFilter[levelCount].user+1,"staked":_levelWiseFilter[levelCount].staked+totalStaked}
        }else{
            _levelWiseFilter[levelCount] = {"user":1,"staked":totalStaked}
        }
        let userTmp= {...item,"level":levelCount,"total_staked":totalStaked}
        if(item?.total_childs>0){
            userTmp.deep_childrens={...checkList(userTmp.deep_childrens,levelCount,_levelWiseFilter)}
        }
        return userTmp
    })
  }

  // for init filter
  useEffect(() => {
    if(level>0){
        filterByLevel()
    }
  },[levelWiseFilter])

  const filterByLevel=()=>{
    setFilterOnLevel(currLevel.current.value)

    if(currLevel.current.value==''){
        let alluser=levelWiseFilter.reduce((prev,curr)=>{
            prev.user+=curr.user
            prev.staked+=curr.staked
            return prev
        },{"user":0,"staked":0})
        setFilterValue({...alluser})
    }else{
        setFilterValue({"user":levelWiseFilter[(currLevel.current.value)]?.user,"staked":levelWiseFilter[(currLevel.current.value)]?.staked})
    }
  }
  return (
    
    <Container>
      <Row>
        <Col xs={6} md={4} className="p-5">
            <Form>
            <Stack gap={2} className="col-md-12 mx-auto">
                <Form.Group>
                    <Form.Select ref={currLevel}> 
                        <option checked={filterOnLevel==""} value="">Select Level</option>
                        {new Array(level).fill(1).map((val,key)=>{
                            return <option checked={filterOnLevel==key} value={key} key={key}>{`Level `+(key+1)}</option>
                        })}
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" onClick={filterByLevel}>
                   Click to Filter
                </Button>
                <Button variant="secondary" onClick={()=>{ currLevel.current.value='', filterByLevel()} }>
                    Clear Filter
                </Button>
            </Stack>
            </Form>
        </Col>
        <Col xs={6} md={4} className="p-5">
            <CardLayout filterOnLevel={filterOnLevel} toalDataOnLevel={filterValue.user} forName='user’s' />
        </Col>
        <Col xs={6} md={4} className="p-5">
            <CardLayout filterOnLevel={filterOnLevel} toalDataOnLevel={filterValue.staked} forName='staked amount'/>
        </Col>
      </Row>
    </Container>
  )
}
