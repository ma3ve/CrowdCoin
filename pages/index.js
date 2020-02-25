import React, { Component } from "react";
import factory from "../ethereum/factory";
import {
  Header,
  Card,
  ItemDescription,
  Button,
  Container
} from "semantic-ui-react";
// import 'bootstrap/dist/css/bootstrap.css'
import Layout from "../components/Layout.js";
import { Link } from "../routes";
class CampaignIndex extends Component {
  // state = {  }
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns: campaigns };
  }

  renderCampaign() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>view campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: "break-word" }
      };
    });

    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <h3>Open campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>

        {this.renderCampaign()}
      </Layout>
    );
  }
}

export default CampaignIndex;
