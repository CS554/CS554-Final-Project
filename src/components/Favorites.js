import React ,{ useContext, useEffect,useState} from 'react';
import { useQuery, gql,useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import '../App.css';
// import firebase from 'firebase';
import { AuthContext } from '../firebase/Auth';
import altTrailImage from '../images/temp_trail_image.jpeg'
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",fontWeight:"bold", fontSize:"50px" };

const useStyles = makeStyles({
  root: {
    flexGrow: 2,
    
  },
  paper: {
    height: 140,
    width: 100,
  },
  media: {
    height: 140,
  },
});

function Favorites(props) {
  const classes = useStyles();
  // const [dData, setdData] = useState();
  // const [tData, settData] = useState();
  const { currentUser } = useContext(AuthContext);
  const userID=currentUser.$b.uid


  const GET_FAV = gql`
	query($userId:ID!) {
		getUser(userId:$userId){
			
            favorites
		
		}
	}
  `;
  
  const GET_TRAILS=gql`
	query($trailId: [ID]!) {
		getTrailsById(trailId:$trailId ) {
			id
			summary
			name
			img
			lat
			long
		}
	}
`;
//delete favorites
const REMOVE_FAVORITE = gql`
mutation delFav($userId: ID!, $oldFavorite: ID!) {
  deleteFavorite(userId: $userId, oldFavorite: $oldFavorite) {
    favorites
  }
}
`;


const [delFavorite] = useMutation(REMOVE_FAVORITE);

//



const { isloading, error, data, refetch } = useQuery(GET_FAV, {
		variables: {
      userId:userID,
    
		}
  });
  
 

  

  
  let trailID="1234";
  
  if(data){
    trailID=data.getUser.favorites;
   }
  const { isloading:loading, error:trailError, data:trailData, refetch:refetchTrails } = useQuery(GET_TRAILS, {
    variables: {
      trailId:trailID,
      
    }
  });

  // useEffect(() => {
  //   setdData(data);
  //   settData(trailData)
  //  }, [data,trailData]);
  
  useEffect(() => {
    console.log("loaded");
    reload();
    
  }, []);

  if(loading || !trailData || isloading){
    return (
			<div style={style}>
			<Loader className="Loader" type="Grid" color="#00BFFF" height={150} width={150} />
			</div>
		)
  }

  

  
  // useEffect(() => {
	// 	console.log('on load useeffect');
  // }, [data,trailData]);



  function reload(){
   //refetch();
  setTimeout(refetch,1000)
   refetchTrails();
  }

  let cards=[];
  if (trailData?.getTrailsById) {
		let newCards = trailData.getTrailsById.map((trail) => {
			if(trail.img == ""){
				trail.img = altTrailImage
			}
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
								<Typography
									gutterBottom
									variant="h5"
									component="h2"
								>
									{trail.name}
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									component="p"
								>
									{trail.summary}
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button size="small" color="primary">
								Share
							</Button>
							<Button size="small" color="primary" onClick={() => { 
                delFavorite({
				variables: {
					oldFavorite: trail.id,
					userId: userID
				}
      });
     reload()
     console.log("clicked");
       }}>
								Remove
							</Button>
						</CardActions>
					</Card>
				</Grid>
			);
    });
    cards = newCards;
  }
  else{
    return(<div style={style}>
      <p>No trails added in favorites</p>
      </div>);
  }
  return (
    <>
    <div>
      <br/></div>
    <Grid container>{cards}</Grid>
    </>
  );

}

export default Favorites;
