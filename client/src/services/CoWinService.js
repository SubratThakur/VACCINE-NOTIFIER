import fetch from 'node-fetch';

export async function fetchListOfStates() {
    const response = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/states`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
}

export async function fetchListOfDistrictForState(stateId) {
    const response = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
}