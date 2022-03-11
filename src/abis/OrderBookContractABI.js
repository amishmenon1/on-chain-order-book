export const OrderBookContractABI = [
         {
           inputs: [
             {
               internalType: "string",
               name: "_id",
               type: "string",
             },
             {
               internalType: "bool",
               name: "_buy",
               type: "bool",
             },
             {
               internalType: "uint256",
               name: "_price",
               type: "uint256",
             },
             {
               internalType: "uint256",
               name: "_quantity",
               type: "uint256",
             },
             {
               internalType: "address",
               name: "_account",
               type: "address",
             },
             {
               internalType: "address",
               name: "_asset",
               type: "address",
             },
           ],
           name: "createOrder",
           outputs: [],
           stateMutability: "nonpayable",
           type: "function",
         },
         {
           inputs: [],
           name: "getAsks",
           outputs: [
             {
               components: [
                 {
                   internalType: "string",
                   name: "orderId",
                   type: "string",
                 },
                 {
                   internalType: "address",
                   name: "maker",
                   type: "address",
                 },
                 {
                   internalType: "address",
                   name: "makeAsset",
                   type: "address",
                 },
                 {
                   internalType: "uint256",
                   name: "makeAmount",
                   type: "uint256",
                 },
                 {
                   internalType: "address",
                   name: "taker",
                   type: "address",
                 },
                 {
                   internalType: "address",
                   name: "takeAsset",
                   type: "address",
                 },
                 {
                   internalType: "uint256",
                   name: "takeAmount",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "salt",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "startBlock",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "endBlock",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "price",
                   type: "uint256",
                 },
                 {
                   internalType: "bool",
                   name: "buy",
                   type: "bool",
                 },
               ],
               internalType: "struct OrderBook.Order[]",
               name: "",
               type: "tuple[]",
             },
           ],
           stateMutability: "view",
           type: "function",
         },
         {
           inputs: [],
           name: "getBids",
           outputs: [
             {
               components: [
                 {
                   internalType: "string",
                   name: "orderId",
                   type: "string",
                 },
                 {
                   internalType: "address",
                   name: "maker",
                   type: "address",
                 },
                 {
                   internalType: "address",
                   name: "makeAsset",
                   type: "address",
                 },
                 {
                   internalType: "uint256",
                   name: "makeAmount",
                   type: "uint256",
                 },
                 {
                   internalType: "address",
                   name: "taker",
                   type: "address",
                 },
                 {
                   internalType: "address",
                   name: "takeAsset",
                   type: "address",
                 },
                 {
                   internalType: "uint256",
                   name: "takeAmount",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "salt",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "startBlock",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "endBlock",
                   type: "uint256",
                 },
                 {
                   internalType: "uint256",
                   name: "price",
                   type: "uint256",
                 },
                 {
                   internalType: "bool",
                   name: "buy",
                   type: "bool",
                 },
               ],
               internalType: "struct OrderBook.Order[]",
               name: "",
               type: "tuple[]",
             },
           ],
           stateMutability: "view",
           type: "function",
         },
       ];
