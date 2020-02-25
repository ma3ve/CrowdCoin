import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  // state = {  }
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const totalContributors = await campaign.methods.totalContributors().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    console.log(requests);

    return { address, requests, totalContributors };
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          address={this.props.address}
          id={index}
          totalContributors={this.props.totalContributors}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h1>Requests </h1>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Id</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finzalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default RequestIndex;
