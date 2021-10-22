import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

export default function EntryHistory({ histories }) {
  return (
    <Table>
      <TableBody>
        {histories.map((history, index) => (
          <TableRow key={index} className="attr_info">
            <TableCell>{history.attr_name}</TableCell>
            <TableCell>
              {history.prev ? (
                <div className="container">
                  <div className="row border">
                    <div className="col-6 border-right">
                      <div className="container">
                        <div className="row">
                          <div className="col-12 border-bottom">
                            <center>変更前</center>
                          </div>
                          <div className="col-12 attr_val prev_attr_value">
                            {history.prev.value}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="container">
                        <div className="row">
                          <div className="col-12 border-bottom">
                            <center>変更後</center>
                          </div>
                          <div className="col-12 attr_val curr_attr_value">
                            {history.curr.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container">
                  <div className="row border">
                    <div className="col-12 border-bottom">
                      <center>初期値</center>
                    </div>
                    <div className="col-12 attr_val">{history.curr.value}</div>
                  </div>
                </div>
              )}
            </TableCell>

            <TableCell>
              <ul className="list-group">
                <li className="list-group-item curr_updated_user">
                  {history.curr.created_user}
                </li>
                <li className="list-group-item curr_updated_time">
                  {history.curr.created_time}
                </li>
              </ul>
            </TableCell>
            <TableCell>
              <span className="replace_attrv" data-toggle="tooltip">
                {history.prev && (
                  <a href="#">
                    <img
                      src="/static/images/update.png"
                      data-toggle="modal"
                      data-target="#renew_checkbox"
                    />
                  </a>
                )}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

EntryHistory.propTypes = {
  histories: PropTypes.arrayOf(
    PropTypes.shape({
      attr_name: PropTypes.string.isRequired,
      prev: PropTypes.shape({
        created_user: PropTypes.string.isRequired,
        created_time: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      }),
      curr: PropTypes.shape({
        created_user: PropTypes.string.isRequired,
        created_time: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      }),
    })
  ).isRequired,
};
