import React, { Component } from "react";
import tokenLogo from "./chainlink-link-logo.png";
import ethLogo from "./eth-logo.png";
import "./OrderForm.css";
import Col from "react-bootstrap/lib/Col";
import Row from "react-bootstrap/lib/Row";

class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      ethBalance: props.ethBalance,
      tokenBalance: props.tokenBalance,
      buyTokens: props.buyTokens,
      web3: props.web3,
      linkEthPrice: props.linkEthPrice,
      priceFeedRefreshing: props.priceFeedRefreshing,
      quantity: 0,
      limitPrice: 0,
      convertToFloat: props.convertToFloat,
      ethBalanceLoading: props.ethBalanceLoading,
      linkBalanceLoading: props.linkBalanceLoading,
    };
  }

  render() {
    let exchangeRateDisplay = this.state.priceFeedRefreshing
      ? "Loading..."
      : "1 LINK = " + this.state.linkEthPrice + " ETH";

    let limitPriceInputDisabled = this.state.ethBalanceLoading;
    let quantityInputDisabled = this.state.ethBalanceLoading;

    return (
      <form
        className="mb-3"
        onSubmit={(event) => {
          event.preventDefault();

          let quantity = this.state.output;
          let limitPrice = this.state.limitPrice;
          this.state.buyTokens(quantity, limitPrice);
        }}
      >
        <Row>
          <Col md={6}>
            <label className="float-left text-muted">
              <b>Input</b>
            </label>
          </Col>
          <Col md={6}>
            <label className="float-right text-muted">
              Balance:&nbsp;{" "}
              {this.state.web3.utils.fromWei(
                this.state.ethBalance.toString(),
                "Ether"
              )}
            </label>
          </Col>
        </Row>
        <Row className="input-group mb-4 order-display">
          <Col md={12}>
            <input
              type="text"
              onChange={(event) => {
                const limitPrice = event.target.value;
                const quantity = parseFloat(
                  limitPrice / 0.00001 //this.state.linkEthPrice
                ).toFixed(8);
                this.setState({
                  limitPrice,
                  output: quantity,
                });
              }}
              ref={(input) => {
                this.input = input;
              }}
              className="form-control form-control-lg order-input"
              placeholder="ETH"
              required
              disabled={limitPriceInputDisabled}
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={ethLogo} height="32" alt="" />
                ETH
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <label className="float-left text-muted">
              <b>Output</b>
            </label>
          </Col>
          <Col md={6}>
            <label className="float-right text-muted">
              Balance:&nbsp;
              {this.state.web3.utils.fromWei(
                this.state.tokenBalance.toString(),
                "Ether"
              )}
            </label>
          </Col>
        </Row>
        <div className="input-group mb-4 order-display">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0 LINK"
            value={"" + this.state.output + " LINK"}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height="32" alt="" />
              LINK
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">{exchangeRateDisplay}</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          PLACE ORDER
        </button>
      </form>
    );
  }
}

export default BuyForm;
