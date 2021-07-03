import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { getEntities } from "../utils/AironeAPIClient";
import { EntityStatus } from "../utils/Constants";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  LeftMenu: {
    backgroundColor: "#d2d4d5",
    height: "100vh",
  },
}));

export default function LeftMenu(props) {
  const classes = useStyles();
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    getEntities()
      .then((resp) => resp.json())
      .then((data) =>
        setEntities(
          data.entities.filter((e) => e.status & EntityStatus.TOP_LEVEL)
        )
      );
  }, []);

  return (
    <Box className={classes.LeftMenu}>
      <List>
        {entities.map((entity) => {
          return (
            <ListItem component={Link} to={`/new-ui/entities/${entity.id}`}>
              <ListItemText primary={entity.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
