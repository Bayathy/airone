import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import AironeBreadcrumbs from "../components/AironeBreadcrumbs";
import {getGroups} from "../utils/AironeAPIClient";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    entityName: {
        margin: theme.spacing(1),
    },
}));

export default function Group(props) {
    const classes = useStyles();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getGroups()
            .then(data => setGroups(data));
    }, []);

    return (
        <div className="container-fluid">
            <AironeBreadcrumbs>
                <Typography component={Link} to='/new-ui/'>Top</Typography>
                <Typography color="textPrimary">グループ管理</Typography>
            </AironeBreadcrumbs>

            <div className="row">
                <div className="col">
                    <div className="float-left">
                        <Button className={classes.button} variant="outlined" color="primary">新規作成</Button>
                        <Button className={classes.button} variant="outlined" color="secondary">エクスポート</Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className={classes.button}
                            component={Link}
                            to={`/new-ui/import`}>
                            インポート
                        </Button>
                    </div>
                    <div className="float-right">
                    </div>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography>名前</Typography></TableCell>
                            <TableCell align="right"><Typography align="left">メンバー</Typography></TableCell>
                            <TableCell align="right"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.map((group) => {
                            return (
                                <TableRow>
                                    <TableCell><Typography>{group.name}</Typography></TableCell>
                                    <TableCell align="right">
                                        <List>
                                            {group.members.map((member) => {
                                                return (
                                                    <ListItem>{member.name}</ListItem>
                                                );
                                            })}
                                        </List>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<DeleteIcon/>}
                                            component={Link}
                                            to={`/groups/${group.id}/delete`}>
                                            削除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
