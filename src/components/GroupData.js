import React,{ useContext, useEffect, useState}  from 'react';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import { AuthContext } from '../firebase/Auth';
import Loader from 'react-loader-spinner';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import '../App.css';

const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",fontWeight:"bold", fontSize:"50px" };

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360
  }
}));
const getGroup = gql`
query getGroup($id: ID!) {
    getGroup (id: $id){
        id
        name
        description
        members
        ownerId
    }
}
`;

const addGroup = gql `
mutation addToGroup($groupId: ID!, $userId: ID!) {
    addUserToGroup(groupId: $groupId, userId: $userId) {
        id
        name
        favorites
        groups
    }
}
`;

const removeGroup = gql `
mutation removeUserFromGroup($groupId: ID!, $userId: ID!) {
    removeUserFromGroup(groupId: $groupId, userId: $userId) {
        id
        name
        favorites
        groups
    }
}
`;

const allUsers = gql `
query listUserInGroup($groupId: ID!) {
    listUsersInGroup(groupId: $groupId) {
        id
        name
    }
}
`;
const useStyles1 = makeStyles({
	root: {
		flexGrow: 1,
		minWidth: 200,
		maxWidth: 500,
		maxHeight: 300
	},
	media: {
		height: 140
	}
});

// const generateRandomColor() = {
//     let r = Math.round((Math.random() * 255)); //red 0 to 255
//     let g = Math.round((Math.random() * 255)); //green 0 to 255
//     let b = Math.round((Math.random() * 255)); //blue 0 to 255
//     return 'rgb(' + r + ', ' + g + ', ' + b + ')';
//   };

function Groups(props) {
  const { isloading, error, data, refetch } = useQuery(getGroup, {variables: {id: props.match.params.id}});
  const { isloading:loading, error:userError, data:userData, refetch:userRefetch } = useQuery(allUsers, {variables: {groupId: props.match.params.id}});
  const { currentUser } = useContext(AuthContext);
  const userID=currentUser.$b.uid;
  const groupData = data?.getGroup
  const classes2 = useStyles2();
  const classes1 = useStyles1();
  const [addToGroups] = useMutation(addGroup);
  const [removeFromGroups] = useMutation(removeGroup);
  let cards = [];
  const [newAdd, setAdd] = useState(false);
  const [newRemove, setRemove] = useState(false);

  // console.log("chran",groupData?.members.indexOf(userID) < 0)
  // console.log("test",newAdd)

  useEffect(() => {
    console.log('on load useeffect');
    async function fetchData() {
      if (groupData?.members.indexOf(userID) < 0){
        setAdd(true)
        setRemove(false)
      }
      else{
        setAdd(false)
        setRemove(true)
      }
    }
    fetchData();
  }, [data, userData]);



  if (userData?.listUsersInGroup) {
    let newUser = userData.listUsersInGroup.map((user) => {
      return (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <Card className={classes1.root} key={user.id}>
                <CardMedia
                  className={classes1.media}
                  title={user.name}
                  alt="trail card"
                  style={{ backgroundColor: "#" + Math.floor(Math.random()* 16777215).toString(16) }}
                  image = "/imgs/take-a-hike-logo.png"
                />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                >
                  {user.name}
                </Typography>
              </CardContent>
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
    });
    cards = newUser;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (/\S/.test(props.match.params.id)) {
      addToGroups({
        variables: {
          groupId: props.match.params.id,
          userId: userID
        }
      });
      setAdd(false);
      setRemove(true);
      setTimeout(userRefetch, 1000);
      setTimeout(refetch,1000);
    }
  };

  const handleSubmit1 = (event) => {
    event.preventDefault();

    if (/\S/.test(props.match.params.id)) {
      removeFromGroups({
        variables: {
          groupId: props.match.params.id,
          userId: userID
        }
      });
      setAdd(true);
      setRemove(false);
      setTimeout(userRefetch, 1000);
      setTimeout(refetch, 1000);
    }
  };

const add = (
  <div>
  <form onSubmit={handleSubmit} className={classes2.root} noValidate autoComplete="off">
  <Button
    type="submit"
    value="Submit"
    size="small"
    color="primary"
  >
    Add to Group
  </Button>
  </form>
  </div>
);

const remove = (
  <div>
  <form onSubmit={handleSubmit1} className={classes2.root} noValidate autoComplete="off">
  <Button
    type="submit"
    value="Submit"
    size="small"
    color="primary"
  >
    Remove from Group
  </Button>
  </form>
  </div>
);

let desc = "" ;
if (groupData && groupData?.description){
  desc = groupData?.description
}
else{
  desc = "You guys need a better leader who puts a description";
}
if (error) {
  return <div>Unexpected Error: {error}</div>;
}
// const val = () => {
//   if (groupData?.members.indexOf(userID) < 0)
//   console.log(groupData?.members.indexOf(userID) > -1)
// }
// val()
console.log("Add",newAdd)
console.log("Remove",newRemove)
if(isloading || !groupData){
  return (
    <div style={style}>
    <Loader className="Loader" type="Grid" color="#00BFFF" height={150} width={150} />
    </div>
  )
}
else{
  return (
    <div>
      <h1>{groupData?.name}</h1>

      <h3>{desc} </h3>
      {newAdd && groupData?.members.indexOf(userID) < 0 && add}
      {newRemove && groupData?.members.indexOf(userID) > -1 && remove}
      <Grid container>{cards}</Grid>
    </div>
  );
}
}

export default Groups;
