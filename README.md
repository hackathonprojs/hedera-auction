# Auction for name service using HCS

## Auction

### Why Auction?

Auctions of valuable resources leads to better price discovery, enabling owners to maximize profit.

### Auction advantages on HCS
- Cheap
    -   Some L1 are very expensive
- Fair and ordered timestamp
    - Achieving fairness on Ethereum system is difficult, you will need to change the auction style to blind auction.  Introduce VDL function that dramatically slow down the finality.  And/or introduce commit-reveal scheme.
- No front-run
    - No need to worry about MEV
- Fast



### HCS serves 2 purposes:
- consensus mechanism
- pubsub mechanism

------------------------
## Cross-chain bond using ZK

Our special twist to this project.  Allowing others to post a bond for auction on other chain.  

### Mechanism:

Hash-locked Contract -> using ZK system to prove user knows the secret to the hash.

### ZK Proof:
Prove you know the secret of the hash

### System used:
RiscZero zkVM

### Hashed timelocked contract (HTLC)
Hashed timelocked contract (HTLC) is the basis of atomic swap, payment channel, etc.  Once it can be proved in another way, we can simplify the derivatives like atomic swap. 


--------------------------------------------------------------

### setup
the project setup follows these instructions: https://docs.hedera.com/hedera/getting-started/environment-set-up




#### attribution
hexagon.png: <a href='https://pngtree.com/freepng/technologically-shaped-hexagonal-border_4731225.html'>png image from pngtree.com/</a>  
7gRx.gif: https://gifer.com/en/7gRx
