// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;

contract OrderBook{
    struct Order {
        string orderId;
        address maker;
        address makeAsset;
        uint makeAmount;
        address taker;
        address takeAsset;
        uint takeAmount;
        uint salt;
        uint startBlock;
        uint endBlock;
        uint price;
        bool buy;
        bool isDeleted;
    }

    
    mapping(string => Order) bids;
    mapping(string => Order) asks;
    string[] bidIds;
    string[] askIds;

    function createOrder(string memory _id, bool _buy, uint _price, uint _quantity, address _account, address _asset) public {
        OrderBook.Order memory order;
        order.orderId = _id;
        order.maker = _account;
        order.makeAsset = _asset;
        order.makeAmount = _quantity;
        order.price = _price;
        
        if(_buy){
            order.buy = true;
            bids[_id] = order;
            bidIds.push(_id);
        }
        else{
            order.buy = false;
            asks[_id] = order;
            askIds.push(_id);
        }
    }

    function deleteOrder(string memory _id, bool _buy) public {
        if(_buy){
            bids[_id].isDeleted = true;
        }
        else{
            asks[_id].isDeleted = true;
        }
    }


    function getBids() public view returns(Order[] memory){
        Order[] memory orders = new Order[](bidIds.length);
        for (uint i = 0; i < bidIds.length; i++) {
            string memory orderUniqueId = bidIds[i];
            orders[i] = bids[orderUniqueId];
        }
        return orders;
    }

    function getAsks() public view returns(Order[] memory){
        Order[] memory orders = new Order[](askIds.length);
        for (uint i = 0; i < askIds.length; i++) {
            string memory orderUniqueId = askIds[i];
            orders[i] = asks[orderUniqueId];
        }
        return orders;
    } 

}