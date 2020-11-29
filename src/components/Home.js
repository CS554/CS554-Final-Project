import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import osm from "./osm-providers";


import useGeoLocation from "../hooks/useGeoLocation";


const markerIcon = new L.Icon({
  iconUrl: "../images/marker.png",
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

const Home = () => {
  const [center, setCenter] = useState({ lat: 0.0000, lng: 0.000000 });
  const [loading, setLoading] = useState(false);
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();
  
  useEffect(() => {
    console.log(mapRef)
    if(mapRef){
      setLoading(true);
    }
  },[mapRef]);


  const location = useGeoLocation();
  console.log(location)
  const showMyLocation = () => {
    console.log(location.loaded)
    console.log(location.error)
    const { current = {} } = mapRef
    const { leafletElement: map } = current
    if (location.loaded && !location.error) {
      map.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true }
      );
    } else {
      alert(location.error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <h2>React-leaflet - Get user location</h2>
          <p>Get user location and highlight it with a marker</p>
          <div className="col">
            <Map ref={mapRef} center={center} zoom={ZOOM_LEVEL} >
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />

              {location.loaded && !location.error && (
                <Marker
                  icon={markerIcon}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                ></Marker>
              )}
            </Map>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-primary" onClick={showMyLocation} disabled={!loading}>
            Locate Me
          </button>
        </div>
      </div>
    </>
  );
};
export default Home;