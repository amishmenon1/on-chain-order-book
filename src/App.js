import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import logo from "./order-book-logo.png";
import "./App.css";
import Web3 from "web3";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Col from "react-bootstrap/lib/Col";
import Row from "react-bootstrap/lib/Row";
import FormToggle from "./FormToggle";
import OrderBookPanel from "./OrderBookPanel";
import { AggregatorV3InterfaceABI } from "./abis/AggregatorV3InterfaceABI";
import { ChainlinkTokenABI } from "./abis/ChainlinkTokenABI";
import { OrderBookContractABI } from "./abis/OrderBookContractABI";

const uuidv4 = require("uuid/v4");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethBalance: "0",
      ethBalanceLoading: false,
      tokenBalance: "0",
      account: "",
      loading: false,
      sortedBids: [],
      sortedAsks: [],
      orderBook: {
        asks: [["0"]],
        bids: [["0"]],
      },
      priceFeedAddress: "0x4d38a35C2D87976F334c2d2379b535F1D461D9B4",
      priceFeed: "",
      priceFeedRefreshing: false,
      priceFeedInitialLoad: false,
      chainlinkTokenAddress: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      chainlinkToken: "",
      chainlinkBalance: "0",
      linkBalanceLoading: false,
      linkEthPrice: "0",
      ethPrice: 0,
      ethPriceLoading: false,
      linkEthRefreshRate: 15000,
      // orderBookContractAddress: "0xfB08E370EcBD3d4f9E909caD14bCA4659E540FA7", //ganache
      orderBookContractAddress: "0x7383deA1f066F424Fb3A989e4277Ade74F9d9ad1", //rinkeby
      orderBookContract: "",
      orderBookIndex: {
        quantity: 3,
        price: 10,
        isDeleted: 12,
      },
      bidTransactionPending: false,
      bidTransactionComplete: false,
      askTransactionPending: false,
      askTransactionComplete: false,
      bidsLoading: false,
      asksLoading: false,
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async componentDidMount() {
    //reload LINK/ETH price every 15 seconds
    setInterval(this.loadLinkEthPrice, this.state.linkEthRefreshRate);
  }

  async loadWeb3() {
    this.enableLoadingFlags();
    const web3 = new Web3(Web3.givenProvider);
    this.setState({ web3 });
  }

  async loadBlockchainData() {
    //load web3
    const web3 = this.state.web3;

    //load price feed contract for LINK / ETH
    this.loadPriceFeedContract();

    //load user account
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });

    await this.loadOrderBookContract();
    await this.loadEthBalance();
    await this.loadChainlinkToken();
    await this.loadTokenBalance();
    await this.loadLinkEthPrice();
    await this.loadOrderBook();
  }

  enableLoadingFlags() {
    this.setState({
      ethBalanceLoading: true,
      linkBalanceLoading: true,
      priceFeedInitialLoad: true,
    });
  }

  loadPriceFeedContract() {
    const web3 = this.state.web3;
    const priceFeed = new web3.eth.Contract(
      AggregatorV3InterfaceABI,
      this.state.priceFeedAddress
    );
    this.setState({ priceFeed });
  }

  loadOrderBookContract() {
    const web3 = this.state.web3;
    const orderBookContract = new web3.eth.Contract(
      OrderBookContractABI,
      this.state.orderBookContractAddress
    );
    this.setState({ orderBookContract });
  }

  async loadChainlinkToken() {
    const web3 = this.state.web3;
    const chainlinkToken = new web3.eth.Contract(
      ChainlinkTokenABI,
      this.state.chainlinkTokenAddress
    );
    this.setState({ chainlinkToken });
  }

  loadTokenBalance = async () => {
    const tokenBalance = await this.state.chainlinkToken.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ chainlinkBalance: tokenBalance });
    this.setState({ linkBalanceLoading: false });
  };

  loadOrderBook = async () => {
    await this.getBids();
    await this.getAsks();
  };

  loadEthBalance = async () => {
    this.setState({ ethBalanceLoading: true });
    const balance = await this.state.web3.eth
      .getBalance(this.state.account)
      .then((balance) => {
        this.setState({ ethBalance: balance });
        this.setState({
          ethBalanceLoading: false,
        });
        return balance;
      });
  };

  loadLinkEthPrice = async () => {
    const web3 = this.state.web3;
    if (!this.state.priceFeedInitialLoad) {
      this.setState({ priceFeedRefreshing: true });
    }
    if (this.state.priceFeed) {
      this.state.priceFeed.methods
        .latestRoundData()
        .call()
        .then((priceResponse) => {
          if (priceResponse.answer && priceResponse.answer._hex) {
            const linkEthPrice = web3.utils.fromWei(priceResponse.answer._hex);
            const formattedLinkEthPrice = parseFloat(linkEthPrice).toFixed(18);
            this.setState({ linkEthPrice: formattedLinkEthPrice.toString() });
            if (this.state.priceFeedInitialLoad) {
              this.setState({ priceFeedInitialLoad: false });
            } else {
              this.setState({ priceFeedRefreshing: false });
            }
          }
        });
    }
  };

  formatOrderQuantity = (number, length) => {
    var num = parseFloat(number).toFixed(5);
    var stringNum = "" + num;
    while (stringNum.length < length) {
      stringNum = "0" + stringNum;
    }

    return stringNum;
  };

  spacer = () => {
    return "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
    // "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    // "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    // "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
  };

  async executeBuyTokenTransaction(tokenAmount, bidPriceInEth) {
    const priceInWei = this.state.web3.utils.toWei(bidPriceInEth);
    const hexPrice = this.state.web3.utils.toHex(priceInWei);
    const quantityInWei = this.state.web3.utils.toWei(tokenAmount.toString());
    const isBuy = true;
    const account = this.state.account;
    const asset = this.state.chainlinkTokenAddress;
    const uuid = uuidv4();

    // params: string memory _id, bool _buy, uint _price, uint _quantity, address _account, address _asset
    const gas = await this.state.orderBookContract.methods
      .createOrder(uuid, isBuy, hexPrice, quantityInWei, account, asset)
      .estimateGas();
    const buyTransaction = await this.state.orderBookContract.methods
      .createOrder(uuid, isBuy, hexPrice, quantityInWei, account, asset)
      .send({
        from: this.state.account,
        gas,
      })
      .once("transactionHash", (hash) => {
        console.log("hash:" + hash);
        this.setState({ bidTransactionPending: true });
      })
      .on("confirmation", (confNumber, receipt) => {
        console.log("confNumber:" + confNumber);
        console.log("receipt:" + receipt);
        if (receipt && !this.state.bidTransactionComplete) {
          this.setState({ bidTransactionComplete: true });
          this.setState({ bidTransactionPending: false });
          this.getBids();

          console.log("Receipt returned");
        }
      })
      .on("error", (error) => {
        console.log("error:" + error);
      });
  }

  async executeSellTokenTransaction(tokenAmount, askPriceInEth) {
    const priceInWei = this.state.web3.utils.toWei(askPriceInEth);
    const hexPrice = this.state.web3.utils.toHex(priceInWei);
    const quantityInWei = this.state.web3.utils.toWei(tokenAmount.toString());
    const isBuy = false;
    const account = this.state.account;
    const asset = this.state.chainlinkTokenAddress;
    const uuid = uuidv4();

    // params: string memory _id, bool _buy, uint _price, uint _quantity, address _account, address _asset
    const gas = await this.state.orderBookContract.methods
      .createOrder(uuid, isBuy, hexPrice, quantityInWei, account, asset)
      .estimateGas();
    const buyTransaction = await this.state.orderBookContract.methods
      .createOrder(uuid, isBuy, hexPrice, quantityInWei, account, asset)
      .send({
        from: this.state.account,
        gas,
      })
      .once("transactionHash", (hash) => {
        console.log("hash:" + hash);
        this.setState({ askTransactionComplete: false });
        this.setState({ askTransactionPending: true });
      })
      .on("confirmation", (confNumber, receipt) => {
        console.log("confNumber:" + confNumber);
        console.log("receipt:" + receipt);
        if (receipt && !this.state.askTransactionComplete) {
          this.setState({ askTransactionComplete: true });
          this.setState({ askTransactionPending: false });
          this.getAsks();

          console.log("Receipt returned");
        }
      })
      .on("error", (error) => {
        console.log("error:" + error);
      });
  }

  buyTokens = async (tokenAmount, bidPriceInEth) => {
    if (tokenAmount && bidPriceInEth) {
      await this.executeBuyTokenTransaction(tokenAmount, bidPriceInEth);
    }
  };

  sellTokens = async (tokenAmount, askPriceInEth) => {
    if (tokenAmount && askPriceInEth) {
      await this.executeSellTokenTransaction(tokenAmount, askPriceInEth);
    }
  };

  getBids = async () => {
    if (this.state.orderBookContract) {
      this.setState({
        bidsLoading: true,
      });
      console.log("bids loading: " + this.state.bidsLoading);
      this.state.orderBookContract.methods
        .getBids()
        .call()
        .then((bidArray) => {
          if (bidArray) {
            var asks = this.state.orderBook.asks;
            var updatedBids = this.state.orderBook.bids;
            updatedBids.length = 0;
            updatedBids.push(["0"]);
            this.setState({
              asks: asks,
              bids: updatedBids,
            });
            const bidOrders = this.mapResponseToOrders(bidArray);
            const sortedBids = this.sortBids(bidOrders);
            this.mapBidsToOrderBook(sortedBids, updatedBids);
            this.setState({
              orderBook: {
                asks: asks,
                bids: updatedBids,
              },
            });
          }
          this.setState({
            bidsLoading: false,
          });
          console.log("bids loading: " + this.state.bidsLoading);
        });
    }
  };

  getAsks = async () => {
    if (this.state.orderBookContract) {
      this.setState({
        asksLoading: true,
      });
      this.state.orderBookContract.methods
        .getAsks()
        .call()
        .then((askArray) => {
          if (askArray) {
            var bids = this.state.orderBook.bids;
            var updatedAsks = this.state.orderBook.asks;
            updatedAsks.length = 0;
            updatedAsks.push(["0"]);
            this.setState({
              asks: updatedAsks,
              bids: bids,
            });
            const askOrders = this.mapResponseToOrders(askArray);
            const sortedAsks = this.sortBids(askOrders);
            this.mapAsksToOrderBook(sortedAsks, updatedAsks);
            this.setState({
              orderBook: {
                asks: updatedAsks,
                bids: bids,
              },
            });
            console.log("bids: " + this.state.orderBook.bids);
            console.log("asks: " + this.state.orderBook.asks);
          }
          this.setState({
            asksLoading: false,
          });
          console.log("asks loading: " + this.state.asksLoading);
        });
    }
  };

  mapResponseToOrders(orderResponse) {
    const orders = [];
    const quantityIndex = this.state.orderBookIndex.quantity;
    const priceIndex = this.state.orderBookIndex.price;
    const deletedIndex = this.state.orderBookIndex.isDeleted;

    orderResponse.forEach((element) => {
      const quantityInWei = element[quantityIndex];
      const bidQuantity = this.state.web3.utils.fromWei(
        quantityInWei.toString()
      );
      const priceInWei = element[priceIndex];
      const bidPrice = this.state.web3.utils.fromWei(priceInWei.toString());
      if (!element[deletedIndex]) {
        orders.push({
          quantity: bidQuantity,
          price: bidPrice,
        });
      }
    });

    return orders;
  }

  mapBidsToOrderBook(sortedBids, updatedBids) {
    sortedBids.forEach((bid) => {
      updatedBids.push([
        bid.price + " ETH" + this.spacer(),
        this.formatOrderQuantity(bid.quantity, 20) + " LINK",
      ]);
    });
  }

  mapAsksToOrderBook(sortedAsks, updatedAsks) {
    sortedAsks.forEach((ask) => {
      updatedAsks.push([
        ask.price + " ETH" + this.spacer(),
        this.formatOrderQuantity(ask.quantity, 20) + " LINK",
      ]);
    });
  }

  loadAsksDisplay(sortedAsks) {
    var bids = this.state.orderBook.bids;
    this.setState({
      asks: [["0"]],
      bids: bids,
    });
    var updatedAsks = this.state.orderBook.asks;
    sortedAsks.forEach((ask) => {
      updatedAsks.push([
        ask.price + " ETH" + this.spacer(),
        this.formatOrderQuantity(ask.quantity, 20) + " LINK",
      ]);
    });
    this.setState({
      orderBook: {
        asks: updatedAsks,
        bids: bids,
      },
    });
  }

  sortBids(unsortedBids) {
    const sorted = unsortedBids.sort(
      (current, next) => next.price - current.price
    );
    return sorted;
  }

  sortAsks(unsortedAsks) {
    const sorted = unsortedAsks.sort(
      (current, next) => current.price - next.price
    );
    return sorted;
  }

  printFlagValues() {
    console.log("askTransactionComplete: " + this.state.askTransactionComplete);
    console.log("askTransactionPending: " + this.state.askTransactionPending);
    console.log("asksLoading: " + this.state.asksLoading);
    console.log("bidTransactionComplete: " + this.state.bidTransactionComplete);
    console.log("bidTransactionPending: " + this.state.bidTransactionPending);
    console.log("bidsLoading: " + this.state.bidsLoading);
    console.log("ethBalanceLoading: " + this.state.ethBalanceLoading);
    console.log("linkBalanceLoading: " + this.state.linkBalanceLoading);
  }

  render() {
    let loadingContent = (
      <a id="loader" className="text-center">
        Loading...
      </a>
    );

    let userPanelContent;

    if (
      this.state.ethBalanceLoading ||
      this.state.linkBalanceLoading ||
      this.state.priceFeedInitialLoad
    ) {
      userPanelContent = loadingContent;
    } else {
      userPanelContent = (
        <FormToggle
          ethBalanceLoading={this.state.ethBalanceLoading}
          ethBalance={this.state.ethBalance}
          linkBalanceLoading={this.state.linkBalanceLoading}
          tokenBalance={this.state.chainlinkBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
          web3={this.state.web3}
          priceFeedRefreshing={this.state.priceFeedRefreshing}
          linkEthPrice={this.state.linkEthPrice}
        />
      );
    }
    // this.printFlagValues();
    let orderBookPanelContent;
    if (
      this.state.priceFeedInitialLoad ||
      this.state.bidsLoading ||
      this.state.asksLoading
    ) {
      orderBookPanelContent = loadingContent;
    } else {
      orderBookPanelContent = (
        <OrderBookPanel
          priceFeedRefreshing={this.state.priceFeedRefreshing}
          linkEthPrice={this.state.linkEthPrice}
          orderBook={this.state.orderBook}
        />
      );
    }

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">ERC20 Order Book</h1>
          </header>
          <Row>
            <Col md={1} />
            <Col md={5} className="dex-window">
              {userPanelContent}
            </Col>
            <Col md={1} />
            <Col md={4}>{orderBookPanelContent}</Col>
            <Col md={1} />
          </Row>
        </div>
      </Router>
    );
  }
}

export default App;
