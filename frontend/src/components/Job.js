import {makeStyles} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";
import React, {useEffect, useState} from "react";
import {
    Breadcrumbs,
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

export default function Job(props) {
    const classes = useStyles();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // TODO implement internal API then call it here
        setJobs([
            {
                id: 1,
                entry: 'entry1',
                operation: '作成',
                status: '完了',
                duration: '1s',
                created_at: '1st Jan 0:00pm',
                note: '',
            },
        ])
    }, []);

    return (
        <div className="container-fluid">
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
                <Typography component={Link} to='/new-ui/'>Top</Typography>
                <Typography color="textPrimary">ジョブ一覧</Typography>
            </Breadcrumbs>

            <div className="row">
                <div className="col">
                    <div className="float-left">
                        <Button className={classes.button} variant="outlined" color="primary">全件表示</Button>
                    </div>
                    <div className="float-right">
                    </div>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography>対象エントリ</Typography></TableCell>
                            <TableCell><Typography>操作</Typography></TableCell>
                            <TableCell><Typography>状況</Typography></TableCell>
                            <TableCell><Typography>実行時間</Typography></TableCell>
                            <TableCell><Typography>実行日時</Typography></TableCell>
                            <TableCell align="right"><Typography>備考</Typography></TableCell>
                            <TableCell align="right"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map((job) => {
                            return (
                                <TableRow>
                                    <TableCell><Typography>{job.entry}</Typography></TableCell>
                                    <TableCell><Typography>{job.operation}</Typography></TableCell>
                                    <TableCell><Typography>{job.status}</Typography></TableCell>
                                    <TableCell><Typography>{job.duration}</Typography></TableCell>
                                    <TableCell><Typography>{job.created_at}</Typography></TableCell>
                                    <TableCell align="right"><Typography>{job.note}</Typography></TableCell>
                                    <TableCell align="right">
                                        <List>
                                            <ListItem>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    component={Link}
                                                    to={`/jobs/${job.id}/rerun`}>
                                                    Re-run
                                                </Button>
                                            </ListItem>
                                            <ListItem>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className={classes.button}
                                                    component={Link}
                                                    to={`/jobs/${job.id}/cancel`}>
                                                    Cancel
                                                </Button>
                                            </ListItem>
                                        </List>
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
