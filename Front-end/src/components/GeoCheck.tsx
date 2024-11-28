import { useLoginData } from "../hooks/useLoginData";

const GeoCheck: React.FC = () => {
  const { handleGeoSubmit } = useLoginData();
  return <button onClick={handleGeoSubmit}>Mobile Sign-In</button>;
};

export default GeoCheck;
