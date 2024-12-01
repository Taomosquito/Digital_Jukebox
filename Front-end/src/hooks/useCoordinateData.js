import { useState } from "react";
import axios from "axios";
export const useCoordinateData = () => {
    const [latitudeCoordinate, setLatitudeCoordinate] = useState(0);
    const [longitudeCoordinate, setLongitudeCoordinate] = useState(0);
    const handleLatitudeCoordinate = (event) => {
        setLatitudeCoordinate(parseFloat(event.target.value));
    };
    const handleLongitudeCoordinate = (event) => {
        setLongitudeCoordinate(parseFloat(event.target.value));
    };
    const handlePushLocationToDatabase = async () => {
        try {
            const response = await axios.post("/back-end/add-location", { latitude: latitudeCoordinate, longitude: longitudeCoordinate }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error("Error adding location:", error);
            throw new Error("Failed to add location");
        }
    };
    return {
        latitudeCoordinate,
        longitudeCoordinate,
        handleLatitudeCoordinate,
        handleLongitudeCoordinate,
        handlePushLocationToDatabase,
    };
};
