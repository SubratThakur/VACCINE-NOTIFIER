import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Users } from './components/Users'
import UnsubscribeUser from './components/UnubscribeUser'
import SubscribeUser from './components/SubscribeUser'
import { getAllUsers, createUserSubscription, unsubscribeUser } from './services/UserService'
import { fetchListOfStates, fetchListOfDistrictForState } from './services/CoWinService'


function App() {
  const DEFAULT_USER = {email:'',phone:'',state:'',district:''};
  const [user, setUser] = useState(DEFAULT_USER)
  const [users, setUsers] = useState([])
  const [states, setStates] = useState([])
  const [district, setDistrict] = useState([])
  const [numberOfUsers, setNumberOfUsers] = useState(0)
  

  const subscribe = (filter) => {
    const DEFAULT_FILTER = { age:[18, 45], vaccine:['covishield', 'covaxin'], type:['free', 'paid']};
    const userFilter = {age:[], vaccine:[], type:[]};
    if(filter.length===0){
      userFilter = DEFAULT_FILTER;
    } else {
      filter.forEach((data)=>{
        if(!isNaN(data) && DEFAULT_FILTER.age.includes(parseInt(data) )){
          userFilter.age.push(data);
        } else if(DEFAULT_FILTER.vaccine.includes(data)) {
          userFilter.vaccine.push(data);
        } else if(DEFAULT_FILTER.type.includes(data)) {
          userFilter.type.push(data);
        } 
      })
    }
    user.filter = userFilter;
    createUserSubscription(user)
        .then(response => {
          console.log(response);
          setNumberOfUsers(numberOfUsers+1)
      });
  }

  const unsubscribe = (user) => {
    unsubscribeUser(user).then(response => {
      console.log(response);
      setUser(DEFAULT_USER);
      setNumberOfUsers(numberOfUsers-response);
    });
  }

  const stateOptions = ()=> {
    if(states.length===0){
      fetchListOfStates().then(response=>{
        const stateList = response.states.map((state) =>  { return { key: state.state_id,
          label: state.state_name,
          value: state.state_id,}
        });
        console.log(stateList);
        setStates(stateList);
      })
    }
}

stateOptions();

const districtOptions = (stateId)=> {
    fetchListOfDistrictForState(stateId)
    .then(resp => {
      const districtList = resp.districts.map((district) => { return {
        key: district.district_id,
        label: district.district_name,
        value: district.district_id,
      }})
      console.log(districtList);
      setDistrict(districtList);
    });
}
  const updateStateAndDistrict = (data, type)=>{
    if(type === 'state'){
      if(user.state?.value !== data.value){
        user.state = data;
        districtOptions(data.value);
      }
    } else {
      user.district = data;
    }
  }

  const fetchAllUsers = () => {
    getAllUsers()
      .then(users => {
        console.log(users)
        setUsers(users);
        setNumberOfUsers(users.length)
      });
  }

  useEffect(() => {
    getAllUsers()
      .then(users => {
        console.log(users)
        setUsers(users);
        setNumberOfUsers(users.length)
      });
  }, [])

  const onChangeForm = (e) => {
      if (e.target.name === 'firstname') {
          user.firstName = e.target.value;
      } else if (e.target.name === 'lastname') {
          user.lastName = e.target.value;
      } else if (e.target.name === 'email') {
          user.email = e.target.value;
      } else if (e.target.name === 'phone') {
          user.phone = e.target.value;
    }
      setUser(user)
  }
    
    return (
        <div className="App">
          <Header
          numberOfUsers={numberOfUsers}
          getAllUsers={fetchAllUsers}
          ></Header>
          <div className="container mrgnbtm">
            <div className="row">
              <div className="col-md-8">

              <Tabs defaultActiveKey="subscribe" id="main-sub-unsub-container">
                <Tab eventKey="subscribe" title="Subscribe Notification">
                  <div className="childContainer">
                    <SubscribeUser 
                        user={user}
                        onChangeForm={onChangeForm}
                        createUser={subscribe}
                        states={states}
                        district={district}
                        onChageDropdown = {updateStateAndDistrict}
                        >
                      </SubscribeUser>
                    </div>
                </Tab>
                <Tab eventKey="unsubscribe" title="Unsubscribe Notification">
                  <div className="childContainer">
                    <p>If you don't want get notified for available slots , you can simple stop your notifications!</p> 
                    <UnsubscribeUser 
                        states={states}
                        districts={district}
                        onChageDropdown = {updateStateAndDistrict}
                        unsubscribeUser={unsubscribe}></UnsubscribeUser>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </div>
          </div>
        </div>
    );
}

export default App;
