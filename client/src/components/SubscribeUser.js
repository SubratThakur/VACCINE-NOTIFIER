import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import Select from 'react-select';

const SubscribeUser = ({user, onChangeForm, createUser, states, district, onChageDropdown}) => {
    const [filter, setFilter] = React.useState(() => ['18', 'covishield', 'covaxin', 'free', 'paid']);
    const [isInvalidState, setInvalidState] = React.useState(false)
    const [isInvalidDistrict, setInvalidDistrict] = React.useState(false);
    const [isInvalidEmail, setInvalidEmail] = React.useState(false);
    const [isInvalidPhone, setInvalidPhone] = React.useState(false);

    let isErrorPresent = false;
    const validateUserData = ()=>{
        if(!user.state){
            setInvalidState(true);
            isErrorPresent = isErrorPresent || true;
        } else {
            setInvalidState(false);
        }
        if(!validateDistrict()){
            setInvalidDistrict(true);
            isErrorPresent = isErrorPresent || true;
        } else {
            setInvalidDistrict(false);
        }
        checkValidEmail();
        checkValidPhone();
    }

    const validateDistrict=()=> {
        if(!user.district || !user.district.value){
            return false
        }
        const filterList = district.filter((district)=>{
            return district.label === user.district.label;
        })
        return filterList.length>0;
    }

    const checkValidEmail=()=> {
        if(!user.email || user.email?.length===0 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email)){
            setInvalidEmail(true);
            isErrorPresent = isErrorPresent || true;
        } else {
            setInvalidEmail(false)
        }
    }

    const checkValidPhone=()=> {
        if(!user.phone || user.phone.length!==10 || !/^[6-9]\d{9}$/.test(user.phone)){
            setInvalidPhone(true);
            isErrorPresent = isErrorPresent || true;
        } else {
            setInvalidPhone(false)
        }
    }

    const onUpdateFormField = (e) => {
        if (e.target.name === 'email') {
            if(isInvalidEmail){
              checkValidEmail()
            }
        } else if (e.target.name === 'phone') {
            if(isInvalidPhone){
              checkValidPhone()
            }
      }
      onChangeForm(e)
    }

    const createSubscription =()=> {
        isErrorPresent = false;
        validateUserData();
        if(!isErrorPresent){
            createUser(filter)
        }
    }

    const handleFormat = (event, newFilter) => {
        setFilter(newFilter);
    };
    let selectedState = user.state.value || {};
    let selectedDistrict = user.district.value || {};
    const handleStateChange = (selectedOption) => {
          setInvalidState(false);
          selectedState = selectedOption.value;
          selectedDistrict = '';
          onChageDropdown(selectedOption, 'state');
          console.log(`Option selected:`, selectedOption)
    };
    const handleDistrictChange = (selectedOption) => {
        selectedDistrict = selectedOption.value;
        setInvalidDistrict(false);
        onChageDropdown(selectedOption, 'district');
        console.log(`Option selected:`, selectedOption)
  };

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-7 mrgnbtm">
                <h2>Subscribe vaccine slot Notification!</h2>
                <form>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputEmail1">First Name</label>
                            <input type="text" onChange={(e) => onUpdateFormField(e)}  className="form-control" name="firstname" id="firstname" aria-describedby="emailHelp" placeholder="First Name" />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputPassword1">Last Name</label>
                            <input type="text" onChange={(e) => onUpdateFormField(e)} className="form-control" name="lastname" id="lastname" placeholder="Last Name" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputState"><b>State</b> (Mandatory)</label>
                            <div className={isInvalidState? 'invalid': ''}>
                            <Select
                                value={selectedState.value}
                                onChange={handleStateChange}
                                options={states}
                            />
                            <div className={isInvalidState? 'error': 'hidden'}>Please select valid state!</div>
                            </div>
                            <div></div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputDistrict"><b>District </b>(Mandatory)</label>
                            <div className={isInvalidDistrict? 'invalid': ''}>
                                <Select
                                    value={selectedDistrict.value}
                                    onChange={handleDistrictChange}
                                    options={district}
                                />
                                <div className={isInvalidDistrict? 'error': 'hidden'}>Please select valid district!</div>
                            </div>
                        </div>
                    </div>
                    <div className="row filter">
                    <ToggleButtonGroup value={filter} onChange={handleFormat} aria-label="text formatting">
                        <ToggleButton value="18" aria-label="18 plus">
                            <b>Age 18+</b>
                        </ToggleButton>
                        <ToggleButton value="45" aria-label="45 plus">
                            <b>Age 45+</b>
                        </ToggleButton>

                        <ToggleButton value="covishield" aria-label="45 plus">
                            <b>Covishield</b>
                        </ToggleButton>

                        <ToggleButton value="covaxin" aria-label="45 plus">
                            <b>Covaxin</b>
                        </ToggleButton>

                        <ToggleButton value="free" aria-label="45 plus">
                            <b>Free</b>
                        </ToggleButton>

                        <ToggleButton value="paid" aria-label="45 plus">
                            <b>Paid</b>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <span className="filter-span">
                        <span className="selected-filter"></span> Selected
                        <br></br>
                        <span className="unselected-filter"></span> Not Selected
                    </span>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputEmail1"><b>Email</b> (Mandatory)</label>
                            <input type="text" onChange={(e) => onUpdateFormField(e)} className={isInvalidEmail? 'form-control invalid': 'form-control'} name="email" id="email" aria-describedby="emailHelp" placeholder="Email" />
                            <div className={isInvalidEmail? 'error': 'hidden'}>Please enter valid email Id!</div>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputPhone1"><b>Phone</b> (Mandatory)</label>
                            <input type="text" onChange={(e) => onUpdateFormField(e)} className={isInvalidPhone? 'form-control invalid': 'form-control'} name="phone" id="phone" aria-describedby="phoneHelp" placeholder="Phone" pattern="[0-9]+"/>
                            <div className={isInvalidPhone? 'error': 'hidden'}>Please enter valid phone number!</div>
                        </div>
                    </div>
                    <button type="button" onClick= {(e) => createSubscription()} className="btn btn-danger">Subscribe</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default SubscribeUser