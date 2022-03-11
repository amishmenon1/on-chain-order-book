import React, { Component } from "react";
import { OrderBook } from "@lab49/react-order-book";
import Col from "react-bootstrap/lib/Col";
import Row from "react-bootstrap/lib/Row";

class OrderBookPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priceFeedRefreshing: props.priceFeedRefreshing,
      linkEthPrice: props.linkEthPrice,
      orderBook: props.orderBook,
      ethBalanceLoading: props.ethBalanceLoading,
      linkBalanceLoading: props.linkBalanceLoading,
    };
  }

  convertToFloat(number) {
    return parseFloat(number).toFixed(8);
  }

  render() {
    let linkEthPriceDisplay;
    if (this.state.priceFeedRefreshing) {
      linkEthPriceDisplay = "Loading asset prices...";
    } else {
      linkEthPriceDisplay = (
        <Row>
          <Col md={5}>
            {/* ETH/USD:{" "}
                  {this.state.ethPriceLoading
                    ? "Fetching..."
                    : "$" + this.state.ethPrice} */}
          </Col>
          <Col md={2}></Col>
          <Col md={5}>LINK / ETH: {this.state.linkEthPrice}</Col>
        </Row>
      );
    }

    return (
      <div>
        <Row>
          <Col md={5}>
            {/* ETH/USD:{" "}
                  {this.state.ethPriceLoading
                    ? "Fetching..."
                    : "$" + this.state.ethPrice} */}
          </Col>
          <Col md={2}></Col>
          <Col md={5}>LINK / ETH: {this.state.linkEthPrice}</Col>
        </Row>
        <Row className="order-book">
          <div className="orders-list">
            <OrderBook
              showSpread={false}
              applyBackgroundColor={true}
              book={this.state.orderBook}
              stylePrefix={""}
              showHeaders={true}
            />
          </div>
        </Row>
      </div>
    );
  }
}

export default OrderBookPanel;
