import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCoordinateData } from "../hooks/useCoordinateData";
const Coordinates = () => {
    const { latitudeCoordinate, longitudeCoordinate, handleLatitudeCoordinate, handleLongitudeCoordinate, handlePushLocationToDatabase, } = useCoordinateData();
    return (_jsxs("div", { children: [_jsx("h2", { children: "Please Reference https://gps-coordinates.org or similar for accurate values" }), _jsxs("form", { onSubmit: (event) => {
                    event.preventDefault();
                    handlePushLocationToDatabase();
                }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "latitude", children: "ENTER LOCATION LATITUDE" }), _jsx("input", { id: "latitude", type: "number", value: latitudeCoordinate, onChange: handleLatitudeCoordinate, required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "longitude", children: "ENTER LOCATION LONGITUDE" }), _jsx("input", { id: "longitude", type: "number", value: longitudeCoordinate, onChange: handleLongitudeCoordinate, required: true })] }), _jsx("button", { type: "submit", children: "Add" })] })] }));
};
export default Coordinates;
