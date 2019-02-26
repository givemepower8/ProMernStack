import React from 'react';
import 'whatwg-fetch';
import PropTypes from 'prop-types';

import IssueAdd from './IssueAdd';
import IssueFilter from './IssueFilter';

const IssueRow = props => {
  const { issue } = props;
  return (
    <tr>
      <td>{issue._id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
      <td>{issue.title}</td>
    </tr>
  );
};

IssueRow.propTypes = {
  issue: PropTypes.isRequired
};

function IssueTable(props) {
  const { issues } = props;
  const issueRows = issues.map(issue => (
    <IssueRow key={issue._id} issue={issue} />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}

IssueTable.propTypes = {
  issues: PropTypes.isRequired
};

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };

    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/api/issues')
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            data.records.forEach(issue => {
              issue.created = new Date(issue.created);
              if (issue.completionDate) {
                issue.completionDate = new Date(issue.completionDate);
              }
            });
            this.setState({ issues: data.records });
          });
        } else {
          response.json().then(error => {
            alert(`Failed to fetch issues ${error.message}`);
          });
        }
      })
      .catch(err => {
        alert(`Error in fetching data from server: ${err}`);
      });
  }

  createIssue(newIssue) {
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue)
    })
      .then(response => {
        if (response.ok) {
          response.json().then(updatedIssue => {
            updatedIssue.created = new Date(updatedIssue.created);
            if (updatedIssue.completionDate) {
              updatedIssue.completionDate = new Date(
                updatedIssue.completionDate
              );
            }
            const newIssues = this.state.issues.concat(updatedIssue);
            this.setState({ issues: newIssues });
          });
        } else {
          response.json().then(error => {
            alert(`Failed to add issue: ${error.message}`);
          });
        }
      })
      .catch(err => {
        alert(`Error in sending data to server: ${err.message}`);
      });
  }

  render() {
    return (
      <div>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </div>
    );
  }
}
