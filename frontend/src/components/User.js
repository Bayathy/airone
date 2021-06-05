import {Breadcrumbs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    entityName: {
        margin: theme.spacing(1),
    },
    breadcrumbs: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        backgroundColor: grey[300],
    },
}));

export default function User(props) {
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // TODO implement internal API then call it here
        setUsers([
            {
                id: 1,
                name: 'test',
                email: 'test@example.com',
                created_at: '',
            },
        ])
    }, []);

    return (
        <div className="container-fluid">
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                <Typography component={Link} to='/new-ui/'>Top</Typography>
                <Typography color="textPrimary">ユーザ管理</Typography>
            </Breadcrumbs>

            <div className="row">
                <div className="col">
                    <div className="float-left">
                        <Button className={classes.button} variant="outlined" color="primary">新規作成</Button>
                        <Button className={classes.button} variant="outlined" color="secondary">エクスポート</Button>
                        <Button className={classes.button} variant="outlined" color="secondary">インポート</Button>
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
                            <TableCell><Typography>メールアドレス</Typography></TableCell>
                            <TableCell><Typography>作成日時</Typography></TableCell>
                            <TableCell align="right"/>
                            <TableCell align="right"/>
                            <TableCell align="right"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            return (
                                <TableRow>
                                    <TableCell><Typography>{user.name}</Typography></TableCell>
                                    <TableCell><Typography>{user.email}</Typography></TableCell>
                                    <TableCell><Typography>{user.created_at}</Typography></TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<EditIcon/>}
                                            component={Link}
                                            to={`/user/${user.id}/edit`}>
                                            編集
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<EditIcon/>}
                                            component={Link}
                                            to={`/user/${user.id}/edit_passwd`}>
                                            パスワード変更
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<DeleteIcon/>}
                                            component={Link}
                                            to={`/user/${user.id}/delete`}>
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
