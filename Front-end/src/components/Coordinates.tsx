import React from "react";
import { useCoordinateData } from "../hooks/useCoordinateData";

const Coordinates: React.FC = () => {
  const {
    latitudeCoordinate,
    longitudeCoordinate,
    locationReference,
    handleLatitudeCoordinate,
    handleLongitudeCoordinate,
    handlePushLocationToDatabase,
    handleLocationReference,
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

        <div>
          <label htmlFor="location_tag">ENTER LOCATION REFERENCE</label>
          <input
            id="loactionRef"
            type="text"
            value={locationReference}
            onChange={handleLocationReference}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Coordinates;
