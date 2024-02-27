import React, { Component } from 'react';
import VehicleForm from './VehicleForm';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            startPoint: { name: '', latitude: null, longitude: null },
            endPoint: { name: '', latitude: null, longitude: null },
            vehicle: '',
            timeOfTravel: '',
            totalEmissions: 0,
            fuelEfficiency: null
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'vehicle') {
            
            this.getFuelEfficiency(value);
        }

        this.setState({
            [name]: value
        });
    }

    handleLocationChange = (field) => (event) => {
        const { value } = event.target;

        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    
                    this.setState(prevState => ({
                        [field]: { name: data[0].display_name, latitude: data[0].lat, longitude: data[0].lon }
                    }));
                } else {
                    
                    console.error('Location not found');
                    
                }
            })
            .catch(error => {
                console.error('Error fetching location:', error);
                
            });
    }

    getFuelEfficiency = (vehicle) => {
        if (!vehicle) {
            // If the vehicle field is empty, set default fuel efficiency to 36 mpg
            this.setState({ fuelEfficiency: 36 });
        }
        
        fetch(`/api/vehicles/${encodeURIComponent(vehicle)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Vehicle not found');
                }
                return response.json();
            })
            .then(data => {
                
                this.setState({
                    fuelEfficiency: data.fuelEfficiency
                });
            })
            .catch(error => {
                console.error('Error fetching fuel efficiency:', error);
                
            });
    }

    calculateTotalEmissions = () => {
        const { startPoint, endPoint, vehicle, timeOfTravel, fuelEfficiency } = this.state;

        
        const distance = this.calculateDistance(startPoint.latitude, startPoint.longitude, endPoint.latitude, endPoint.longitude);

        let totalEmissions;

        if (vehicle && fuelEfficiency) 
            totalEmissions = distance * fuelEfficiency;
        } else {
            // Use default fuel efficiency (36 mpg) if vehicle or fuel efficiency is not provided
            totalEmissions = distance * 36;
        }

        this.setState({ totalEmissions });
    }


    calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    }

    render() {
        return (
            <div>
                <h1>Team 2 Emission Calculator</h1>
                <p>Input the following variables to calculate your emissions!</p>

                <div>
                    <label>Start Point:</label>
                    <input
                        type="text"
                        name="startPoint"
                        value={this.state.startPoint.name}
                        onChange={this.handleInputChange}
                        onBlur={this.handleLocationChange('startPoint')}
                        style={{ width: '600px', height: '30px' }} 
                    />
                </div>

                <div>
                    <label>End Point:</label>
                    <input
                        type="text"
                        name="endPoint"
                        value={this.state.endPoint.name}
                        onChange={this.handleInputChange}
                        onBlur={this.handleLocationChange('endPoint')}
                        style={{ width: '600px', height: '30px' }} 
                    />
                </div>

                <div>
                    <VehicleForm />
                </div>

              

              

                <div>
                    <button onClick={this.calculateTotalEmissions}>Calculate Total Emissions</button>
                </div>

                <div>
                    <label>Total Emissions (g/km): </label>
                    <input
                        type="text"
                        name="totalEmissions"
                        value={this.state.totalEmissions}
                        readOnly
                        style={{ width: '300px', height: '30px' }}
                    />
                </div>

            </div>
        );
    }
}
