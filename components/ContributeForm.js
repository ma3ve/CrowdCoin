import React, { Component } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign.js";
import web3 from "../ethereum/web3";
import { Router } from "../routes.js";
class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false
  };
  onSubmit = async event => {
    this.setState({ loading: true, errorMessage: "" });
    event.preventDefault();
    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, value: "" });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>amount to contibute</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message
          error
          header="oops!"
          content={this.state.errorMessage}
        ></Message>
        <Button type="submit" primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
