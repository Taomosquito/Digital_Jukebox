import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCoordinateData } from "../hooks/useCoordinateData";
import "../styles/admin/Coordinates.scss";
const Coordinates = () => {
    const { latitudeCoordinate, longitudeCoordinate, locationReference, handleLatitudeCoordinate, handleLongitudeCoordinate, handlePushLocationToDatabase, handleLocationReference, } = useCoordinateData();
    return (_jsx("div", { className: "coordinates__modal-overlay", children: _jsxs("div", { className: "coordinates__modal-content", children: [_jsx("h3", { children: "Please Reference https://gps-coordinates.org or similar for accurate values" }), _jsxs("form", { onSubmit: (event) => {
                        event.preventDefault();
                        handlePushLocationToDatabase();
                    }, children: [_jsxs("div", { className: "coordinates__location-latitude", children: [_jsx("label", { htmlFor: "latitude", children: "Enter Location Latitude: " }), _jsx("br", {}), _jsx("input", { id: "latitude", type: "number", value: latitudeCoordinate, onChange: handleLatitudeCoordinate, required: true })] }), _jsxs("div", { className: "coordinates__location-longitude", children: [_jsx("label", { htmlFor: "longitude", children: "Enter Location Longitude: " }), _jsx("br", {}), _jsx("input", { id: "longitude", type: "number", value: longitudeCoordinate, onChange: handleLongitudeCoordinate, required: true })] }), _jsxs("div", { className: "coordinates__location-reference", children: [_jsx("label", { htmlFor: "location_tag", children: "Enter Location Reference: " }), _jsx("input", { id: "loactionRef", type: "text", value: locationReference, onChange: handleLocationReference, required: true })] }), _jsx("button", { type: "submit", children: "Add" })] })] }) }));
};
export default Coordinates;
