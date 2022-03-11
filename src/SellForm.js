import React, { Component } from "react";
import tokenLogo from "./chainlink-link-logo.png";
import ethLogo from "./eth-logo.png";
import "./OrderForm.css";
import Col from "react-bootstrap/lib/Col";
import Row from "react-bootstrap/lib/Row";

class SellForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      ethBalance: props.ethBalance,
      tokenBalance: props.tokenBalance,
      sellTokens: props.sellTokens,
      web3: props.web3,
      linkEthPrice: props.linkEthPrice,
      priceFeedRefreshing: props.priceFeedRefreshing,
      limitPrice: 0,
      convertToFloat: props.convertToFloat,
      ethBalanceLoading: props.ethBalanceLoading,
      linkBalanceLoading: props.linkBalanceLoading,
    };
  }

  render() {
    let exchangeRateDisplay = this.state.priceFeedRefreshing
      ? "Loading..."
      : "1 ETH = " + 1 / this.state.linkEthPrice + " LINK";

    let limitPriceInputDisabled = this.state.ethBalanceLoading;
    let quantityInputDisabled = this.state.ethBalanceLoading;

    return (
      <form
        className="mb-3"
        onSubmit={(event) => {
          event.preventDefault();

          let quantity = this.state.output;
          let limitPrice = this.state.limitPrice;
          this.state.sellTokens(quantity, limitPrice);
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
              Balance:&nbsp;
              {this.state.web3.utils.fromWei(
                this.state.tokenBalance.toString(),
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
                  limitPrice * 0.0001 //this.state.linkEthPrice
                ).toFixed(18);
                this.setState({
                  limitPrice,
                  output: quantity,
                });
              }}
              ref={(input) => {
                this.input = input;
              }}
              className="form-control form-control-lg order-input"
              placeholder="LINK"
              required
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={tokenLogo} height="32" alt="" />
                LINK
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
              {this.state.web3.utils.fromWei(this.props.ethBalance.toString())}
            </label>
          </Col>
        </Row>
        <div className="input-group mb-4 order-display">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={"" + this.state.output + " ETH"}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height="32" alt="" />
              ETH
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

export default SellForm;
