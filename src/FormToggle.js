import React, { Component } from "react";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";
import "./FormToggle.css";

class FormToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: "buy",
      ethBalance: props.ethBalance,
      tokenBalance: props.tokenBalance,
      buyTokens: props.buyTokens,
      sellTokens: props.sellTokens,
      buySelected: true,
      web3: props.web3,
      linkEthPrice: props.linkEthPrice,
      priceFeedRefreshing: props.priceFeedRefreshing,
      linkBalanceLoading: props.linkBalanceLoading,
      ethBalanceLoading: props.ethBalanceLoading,
    };
  }

  convertToFloat(number) {
    return parseFloat(number).toFixed(8);
  }

  render() {
    let content;
    if (this.state.currentForm === "buy") {
      content = (
        <BuyForm
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.state.buyTokens}
          web3={this.state.web3}
          linkEthPrice={this.state.linkEthPrice}
          priceFeedRefreshing={this.state.priceFeedRefreshing}
          convertToFloat={this.convertToFloat}
          linkBalanceLoading={this.state.linkBalanceLoading}
          ethBalanceLoading={this.state.ethBalanceLoading}
        />
      );
    } else {
      content = (
        <SellForm
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          sellTokens={this.state.sellTokens}
          web3={this.state.web3}
          linkEthPrice={this.state.linkEthPrice}
          priceFeedRefreshing={this.state.priceFeedRefreshing}
          convertToFloat={this.convertToFloat}
          linkBalanceLoading={this.state.linkBalanceLoading}
          ethBalanceLoading={this.state.ethBalanceLoading}
        />
      );
    }

    const buySelectionStyle =
      this.state.currentForm === "buy" ? "button-selected" : "";

    const sellSelectionStyle =
      this.state.currentForm === "buy" ? "" : "button-selected";

    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3 form-toggle-buttons">
          <button
            className={"btn btn-light " + buySelectionStyle}
            onClick={(event) => {
              this.setState({ currentForm: "buy" });
            }}
          >
            Buy
          </button>
          <span className="text-muted">
            &nbsp; &lt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &gt; &nbsp;
          </span>
          <button
            className={"btn btn-light " + sellSelectionStyle}
            onClick={(event) => {
              this.setState({ currentForm: "sell" });
            }}
          >
            Sell
          </button>
        </div>

        <div className="card mb-4 dex-main">
          <div className="card-body">{content}</div>
        </div>
      </div>
    );
  }
}

export default FormToggle;
