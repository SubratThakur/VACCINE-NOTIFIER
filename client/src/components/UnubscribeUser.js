import React from 'react'
import Select from 'react-select';


const UnsubscribeUser = ({states, districts,onChageDropdown, unsubscribeUser }) => {

    const [isInvalidEmail, setInvalidEmail] = React.useState(false);
    const [isInvalidPhone, setInvalidPhone] = React.useState(false);
    const [user, setUser] = React.useState({email:"", phone: "", state: "", district: ""})
    let isErrorPresent = false;
    let selectedState = user.state?.value || {};
    let selectedDistrict = user.district?.value || {};
    const handleStateChange = (selectedOption) => {
          selectedState = selectedOption.value;
          user.state = selectedOption;
          setUser(user);
          selectedDistrict = '';
          onChageDropdown(selectedOption, 'state');
          console.log(`Option selected:`, selectedOption)
    };
    const handleDistrictChange = (selectedOption) => {
        selectedDistrict = selectedOption.value;
        user.district = selectedOption;
        setUser(user);
        console.log(`Option selected:`, selectedOption)
  };

    const onChangeForm=(e)=>{
        if (e.target.name === 'email') {
            user.email = e.target.value;
            setUser(user);
            if(isInvalidEmail){
              checkValidEmail()
            }
        } else if (e.target.name === 'phone') {
            user.phone = e.target.value;
            setUser(user);
            if(isInvalidPhone){
              checkValidPhone()
            }
      }
    }

    const validateUserData=()=>{
        checkValidEmail();
        checkValidPhone();
        return isErrorPresent;
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

    const validateDataAndUnsubscribeUser=(e)=>{
        isErrorPresent = false;
        if(!validateUserData()){
            unsubscribeUser(user); 
        }

    }

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-7 mrgnbtm">
                <h2>Unsubscribe User!</h2>
                <form>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputEmail1"><b>Email</b> (Mandatory)</label>
                            <input type="text" onChange={(e) => onChangeForm(e)} className={isInvalidEmail? 'form-control invalid': 'form-control'} name="email" id="email" aria-describedby="emailHelp" placeholder="Email" />
                            <div className={isInvalidEmail? 'error': 'hidden'}>Please enter valid email Id!</div>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputPhone1"><b>Phone</b> (Mandatory)</label>
                            <input type="text" onChange={(e) => onChangeForm(e)} className={isInvalidPhone? 'form-control invalid': 'form-control'} name="phone" id="phone" aria-describedby="phoneHelp" placeholder="Phone" pattern="[0-9]+"/>
                            <div className={isInvalidPhone? 'error': 'hidden'}>Please enter valid phone number!</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputState"><b>State</b> (Mandatory)</label>
                            <Select
                                value={selectedState.value}
                                onChange={handleStateChange}
                                options={states}
                            />
                            <div></div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="exampleInputDistrict"><b>District </b>(Mandatory)</label>
                                <Select
                                    value={selectedDistrict.value}
                                    onChange={handleDistrictChange}
                                    options={districts}
                                />
                        </div>
                    </div>
                    <div className="row">
                    <div className="form-group col-md-12">
                    <div class="info">
                        <p><strong>Info!</strong> If you have setup notification for multiple places and you just wanted to unsubscribe notification for single state/district then choose that particular state/district!</p>
                    </div>
                    </div>
                    </div>
                    <button type="button" onClick= {(e) => validateDataAndUnsubscribeUser()} className="btn btn-danger">Unsubscribe</button>
                </form>
                </div>
            </div>
            
        </div>
    )
}

export default UnsubscribeUser