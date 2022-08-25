import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { moveCard } from '../../actions/board';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Moment from 'react-moment';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useStyles from '../../utils/modalStyles';

const MoveCard = ({ cardId, setOpen, thisList }) => {
  const classes = useStyles();
  const [listObject, setListObject] = useState(null);
  const [listTitle, setListTitle] = useState('');
  const [position, setPosition] = useState(0);
  const [positions, setPositions] = useState([0]);
  const lists = useSelector((state) => state.board.board.lists);
  const listObjects = useSelector((state) =>
    state.board.board.listObjects
      .sort(
        (a, b) =>
          lists.findIndex((id) => id === a._id) - lists.findIndex((id) => id === b._id)
      )
      .filter((list) => !list.archived)
  );
  const cardObjects = useSelector((state) => state.board.board.cardObjects);
  const dispatch = useDispatch();

  const [activityChunks, setActivityChunks] = useState(1);
  const activity = useSelector((state) => state.board.board.activity);

  useEffect(() => {
    setListObject(thisList);
    setListTitle(thisList.title);
  }, [thisList, cardId]);

  useEffect(() => {
    if (listObject) {
      const unarchivedListCards = listObject.cards
        .map((id, index) => {
          const card = cardObjects.find((object) => object._id === id);
          const position = index;
          return { card, position };
        })
        .filter((card) => !card.card.archived);
      let cardPositions = unarchivedListCards.map((card) => card.position);
      if (listObject !== thisList) {
        cardPositions = cardPositions.concat(listObject.cards.length);
      }
      if (listObject.cards.length > 0) {
        setPositions(cardPositions);
        setPosition(thisList.cards.findIndex((id) => id === cardId));
      } else {
        setPositions([0]);
        setPosition(0);
      }
    }
  }, [thisList, cardId, listObject, cardObjects]);

  const onSubmit = async () => {
    dispatch(
      moveCard(cardId, { fromId: thisList._id, toId: listObject._id, toIndex: position })
    );
    setOpen(false);
  };

  return (
    <div className={classes.moveCard}>
                <div className={classes.activityTitle}>
              <h3>Activity</h3>
            </div>
            <List>
              {activity.slice(0, activityChunks * 5).map((activity) => (
                <ListItem key={activity._id}>
                  <ListItemText
                    primary={activity.text}
                    secondary={<Moment fromNow>{activity.date}</Moment>}
                  />
                </ListItem>
              ))}
            </List>
            <div className={classes.viewMoreActivityButton}>
              <Button
                disabled={activityChunks * 10 > activity.length}
                onClick={() => setActivityChunks(activityChunks + 1)}
              >
                View More Activity
              </Button>
            </div>
         
    
    </div>
  );
};

MoveCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  thisList: PropTypes.object.isRequired,
};

export default MoveCard;
