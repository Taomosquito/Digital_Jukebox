import React from "react";
import { useCoordinateData } from "../hooks/useCoordinateData";

const Coordinates: React.FC = () => {
  const {
    latitudeCoordinate,
    longitudeCoordinate,
    handleLatitudeCoordinate,
    handleLongitudeCoordinate,
    handlePushLocationToDatabase,
  } = useCoordinateData();

  return (
    <div>
      <h2>
        Please Reference https://gps-coordinates.org or similar for accurate
        values
      </h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handlePushLocationToDatabase();
        }}
      >
        <div>
          <label htmlFor="latitude">ENTER LOCATION LATITUDE</label>
          <input
            id="latitude"
            type="number"
            value={latitudeCoordinate}
            onChange={handleLatitudeCoordinate}
            required
          />
        </div>

        <div>
          <label htmlFor="longitude">ENTER LOCATION LONGITUDE</label>
          <input
            id="longitude"
            type="number"
            value={longitudeCoordinate}
            onChange={handleLongitudeCoordinate}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Coordinates;
