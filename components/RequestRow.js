import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  state = { approveLoading: false, finalizingLoading: false };
  onApprove = async () => {
    this.setState({ approveLoading: true });
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    await campaign.methods.approverequest(this.props.id).send({
      from: accounts[0]
    });
    this.setState({ approveLoading: false });
    window.location.reload();
  };
  onFinalize = async () => {
    this.setState({ finalizingLoading: true });
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    await campaign.methods.finalizerequest(this.props.id).send({
      from: accounts[0]
    });
    this.setState({ finalizingLoading: false });
    window.location.reload();
  };
  render() {
    const { Row, Cell } = Table;
    const { id, request, totalContributors } = this.props;
    const readyToFinalize = request.totalApprovals > totalContributors;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.totalApprovals}/{totalContributors}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="green"
              basic
              onClick={this.onApprove}
              loading={this.state.approveLoading}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="teal"
              basic
              onClick={this.onFinalize}
              loading={this.state.finalizingLoading}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
