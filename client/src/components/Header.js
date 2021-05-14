import React from 'react'

export const Header = ({numberOfUsers, getAllUsers}) => {

    const headerStyle = {

        width: '100%',
        padding: '2%',
        backgroundColor: "#1c424a",
        color: 'white',
        textAlign: 'left'
    }

    return(
        <div className="container mrgnbtm" style={headerStyle}>
            <div className="row">
              <div className="col-md-8">
                <div>
                    <h1>Vaccine Notifier</h1>
                    <p> Subscribe notification for daily updated vaccine slots !</p>
                </div>
                </div>
                <div className="col-md-4">
                <h4 style={{color: 'white'}}>Total Subscribed Users</h4>
                    <span className="number">
                    {numberOfUsers}
                    </span>
                </div>
            </div>
        </div>

    )
}