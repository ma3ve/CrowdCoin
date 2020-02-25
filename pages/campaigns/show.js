import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign.js";
import { Card, Grid, Button } from "semantic-ui-react";
// import header from "../../components/header";
import web3 from "../../ethereum/web3.js";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";
// import Link from "next/link";

class CampaignShow extends Component {
  // state = { result };
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getsummary().call();

    return {
      address: props.query.address,
      minimumContibution: summary[0],
      balance: summary[1],
      totalContributors: summary[2],
      requestscount: summary[3],
      manager: summary[4]
    };
  }
  renderCards() {
    const {
      balance,
      manager,
      minimumContibution,
      requestscount,
      totalContributors
    } = this.props;
    const items = [
      {
        header: manager,
        meta: "address of manager",
        description:
          "the manager created this camapign and can create requests",
        style: { overflowWrap: "break-word" }
      },
      {
        header: minimumContibution,
        meta: "Minimum Contribution(wei)",
        description:
          "you must contribute aleast this musch wei to become contributor"
      },
      {
        header: totalContributors,
        meta: "No. of Contibutors",
        description: "No. of who have already donated"
      },
      {
        header: requestscount,
        meta: "No of requests",
        description:
          "A request tries to withdraw money form the contract and give it to recipient"
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance(ether)",
        description: "The balance is how much money this campaign has"
      }
    ];
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary> View requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
