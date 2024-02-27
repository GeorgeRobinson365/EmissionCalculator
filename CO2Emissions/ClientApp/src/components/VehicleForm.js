import React, { useState } from 'react';

const vehicleData = {
    "Ford Explorer": 20,
    "Mazda": 25,
    "Vauxhall": 30,
}

const VehicleForm = () => {
    const [selectedVehicle, setSelectedVehicle] = useState("");

    const handleVehicleChange = (event) => {
        setSelectedVehicle(event.target.value);
    };

    return (
        <div>
            <label>Select Vehicle:</label>
            <select value={selectedVehicle} onChange={handleVehicleChange}>
                <option value="">Choose a vehicle</option>
                {Object.keys(vehicleData).map((vehicle) => (
                    <option key={vehicle} value={vehicle}>{vehicle}</option>
                ))}
            </select>
            {selectedVehicle && (
                <p>Miles per gallon: {vehicleData[selectedVehicle]}</p>
            )}
        </div>
    );
};

export default VehicleForm;
