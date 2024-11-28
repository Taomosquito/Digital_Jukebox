import { useEffect, useState } from "react";
import axios from "axios";

const useGeoLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch geolocation on site load
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
      },
      (err) => {
        setError("Unable to retrieve location.");
        console.error("Geolocation error:", err);
      }
    );
  }, []); // Runs only once, on site load

  return { latitude, longitude, error };
};

export default useGeoLocation;
