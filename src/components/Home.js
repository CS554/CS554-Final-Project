import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import osm from './osm-providers';
import useGeoLocation from '../hooks/useGeoLocation';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import { useQuery, gql, useLazyQuery } from '@apollo/react-hooks';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minWidth: 200,
    maxWidth: 500,
    maxHeight: 300,
  },
  media: {
    height: 140,
  },
});

const query2 = gql`
query trails($lat: Float!, $long: Float!) {
  listTrails(lat: $lat, long: $long) {
    id
    summary
    name
    img
  }
}`;

const Home = (props) => {
  const [center, setCenter] = useState({ lat: 0.0, lng: 0.0});
  const { isloading, error, data, refetch } = useQuery(query2, {
    variables: { lat: center.lat, long: center.lng },
  });


  const [cards, setCards] = useState([]);
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();
  const classes = useStyles();
  console.log(data);
  // Request trails request reference

  useEffect(() => {
    console.log('on load useeffect');
    function fetchData() {
      let newCards = []
      try {
        refetch();
        console.log("Editing Cards!")
        console.log(center.lat)
        console.log(center.lng)
        console.log(data)
        if (!isloading && data.listTrails) {
          newCards = data.listTrails.map((trail) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={trail.id}>
                <Card className={classes.root} key={trail.id}>
                  <CardActionArea>
                    <Link to={`/trails/${trail.id}`}>
                      <CardMedia
                        className={classes.media}
                        image={trail.img}
                        title={trail.name}
                        alt="trail card"
                      />
                    </Link>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {trail.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {trail.summary}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                  </Button>
                    <Button size="small" color="primary">
                      Learn More
                  </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
          console.log(newCards)
          setCards(newCards);
        } else if (isloading) {
            return <div>Loading</div>
          } else if (error) {
            return <div>{error.message}</div>
          }
          console.log(cards)
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [center]);


  const location = useGeoLocation();
  console.log(location);
  const showMyLocation = () => {
    console.log(location);
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    if (location.loaded && !location.error) {

      map.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true },
      );
      console.log({lat: location.coordinates.lat, lng: location.coordinates.lng});

      setCenter({lat: location.coordinates.lat, lng: location.coordinates.lng})
      setCenter((center) => {
        console.log(center);
        return center;
      });
      
    } else {
      alert('loading location...');
    }
  };

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <h2>Find your Location</h2>
          <p>Find Hiking trails near you!</p>
          <div className="col">
            <Map ref={mapRef} center={center} zoom={ZOOM_LEVEL}>
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />

              {location.loaded && !location.error && (
                <Marker
                  icon={DefaultIcon}
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
          <button
            className="btn btn-primary"
            onClick={showMyLocation}
            disabled={!location.loaded}
          >
            Locate Me
          </button>
        </div>
      </div>
      <Grid container>{cards}</Grid>
    </>
  );
};
export default Home;
