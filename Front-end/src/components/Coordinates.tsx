import React from "react";
import { useCoordinateData } from "../hooks/useCoordinateData";
import "../styles/admin/Coordinates.scss"

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
    <div className="coordinates__modal-overlay">
      <div className="coordinates__modal-content">
        <h3>
          Please Reference https://gps-coordinates.org or similar for accurate
          values
        </h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handlePushLocationToDatabase();
          }}
        >
          <div className="coordinates__location-latitude">
            <label htmlFor="latitude">Enter Location Latitude: </label><br />
            <input
              id="latitude"
              type="number"
              value={latitudeCoordinate}
              onChange={handleLatitudeCoordinate}
              required
            />
          </div>

          <div className="coordinates__location-longitude">
            <label htmlFor="longitude">Enter Location Longitude: </label><br />
            <input
              id="longitude"
              type="number"
              value={longitudeCoordinate}
              onChange={handleLongitudeCoordinate}
              required
            />
          </div>

          <div className="coordinates__location-reference">
            <label htmlFor="location_tag">Enter Location Reference: </label>
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
      
    </div>
  );
};

export default Coordinates;
