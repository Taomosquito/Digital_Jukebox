import { jsx as _jsx } from "react/jsx-runtime";
import { useLoginData } from "../hooks/useLoginData";
const GeoCheck = () => {
    const { handleGeoSubmit } = useLoginData();
    return _jsx("button", { onClick: handleGeoSubmit, children: "Mobile Sign-In" });
};
export default GeoCheck;
