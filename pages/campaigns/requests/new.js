import React, { Component } from "react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Layout from "../../../components/Layout";

class RequestNew extends Component {
  state = {
    value: "",
    description: " ",
    recipient: "",
    errMessage: "",
    loading: false
  };
  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }
  onSumbit = async event => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;
    this.setState({ errMessage: "", loading: "true" });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>back</a>
        </Link>
        <h3>Create Request</h3>
        <Form onSubmit={this.onSumbit} error={!!this.state.errMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Amount in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="oops!" content={this.state.errMessage} />

          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
