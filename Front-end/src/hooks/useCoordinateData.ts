import { useState } from "react";
import axios from "axios";

export const useCoordinateData = () => {
  const [latitudeCoordinate, setLatitudeCoordinate] = useState<number>(0);
  const [longitudeCoordinate, setLongitudeCoordinate] = useState<number>(0);

  const handleLatitudeCoordinate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLatitudeCoordinate(parseFloat(event.target.value));
  };

  const handleLongitudeCoordinate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLongitudeCoordinate(parseFloat(event.target.value));
  };

  const handlePushLocationToDatabase = async () => {
    try {
      const response = await axios.post<any>(
        "/back-end/add-location",
        { latitude: latitudeCoordinate, longitude: longitudeCoordinate },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
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
