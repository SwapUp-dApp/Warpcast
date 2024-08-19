import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { createSystem } from "frog/ui";

import { serveStatic } from "@hono/node-server/serve-static";

import { app as summaryApp } from "./pages/summary";
import RowColumn from "./component/RowColumn";
import NftGroups from "./component/NftGroups";
import Title from "./component/Title";
import axios from "axios";
export const { Box, Image, Text, Columns, Column, Rows, Row } = createSystem();

type State = {
  nftNum: number;
  initNfts: any[];
};
export const app = new Frog<{ State: State }>({
  title: "Frog Frame",
  initialState: {
    nftNum: 0,
    initNfts: []
  },
});

let nftNum: number = -1;

app.use("/*", serveStatic({ root: "./public" }));

app.frame("/", async (c) => {
  const { buttonValue,  deriveState } = c;
  if (buttonValue === undefined) {
    nftNum = -1;
  } else {
    let a: any = buttonValue;
    a = a * 1;
    nftNum = nftNum + a;
  }
  const state = await deriveState(async (previousState: any) => {
    if (previousState.initNfts.length === 0) {
      try {
        const response = await axios.get("http://localhost:8800/api/openswap/list");// replace your real api endpoint
        previousState.initNfts = response.data.data;   
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }
  
    return previousState;
  });
  return c.res({
    image: (
      <div
        style={{
          background: "#252539",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: "5%",
        }}
      >
        <div style={{ display: "flex", width: "20%", height: "18%" }}>
          <Image
            src="https://warpcast-nft-frame.vercel.app/asset/image/SwapUp_Logo.png"
            width="20"
            height="8"
          />
        </div>
        <div
          style={{
            display: "flex",
            color: "#8e8e93",
            flexDirection: "column",
            fontSize: "20",
          }}
        >
          <Text>Trade ID XXXXXX</Text>
          <Text>I am trading.</Text>
        </div>
        <NftGroups nftNum={state.nftNum} state = {state.initNfts} />
        <div
          style={{
            display: "flex",
            color: "#8e8e93",
            flexDirection: "column",
            fontSize: "20",
            marginTop: "10",
          }}
        >
          <Text>I want</Text>
          <Text> 28 ETH</Text>
        </div>
      </div>
    ),
    intents: [
      nftNum !== -1 && (
        <Button value={"-1"} action="/">
          ←
        </Button>
      ),
      nftNum !== 3 && (
        <Button value={"1"} action="/">
          →
        </Button>
      ),
      nftNum === -1 && (
        <Button action="/summary" value="review">
          Review
        </Button>
      ),
      nftNum !== -1 && (
        <Button action={"/nft/" + state.initNfts[0].open_trade_id} value="detail"> 
        {/* replace   0 with nftNum*/}
          Detail
        </Button>
      ),
    ],
  });
});

app.frame("/nft/:id", async (c) => {

  const { id } = c.req.param();

  console.log('id', id) 

  const detail = await axios.get(`http://localhost:8800/api/swaps/get-swap-details/?trade_id=${id}`);
   console.log(detail) 

    {/*In this you can test with this endpoint*/}
     //test api
     //const detail = await axios.get("http://localhost:8800/api/swaps/get-swap-details/?trade_id=f917c6b8-6701-4c5c-a53b-0b327e311d22");
     // console.log(detail)
  return c.res({
    image: (
      <div
        style={{
          background: "#252539",
          backgroundSize: "100% 100%",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "20",
        }}
      >
        <div style={{ display: "flex", width: "25%" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              borderRadius: "20px",
              padding: "10px",
            }}
          >
            <Image
              width="64"
              src={
               ""
              //  replace image src with detail data. after get detailed data with ID.
              }
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title />
          <RowColumn
            item="Owner wallet address"
            value="0x1431F28C4cd4deA4332128297cc43aD1EdD23f83434aD1EdD23f83"
          />
          <RowColumn
            item="Contract address"
            value="0x8a9b7321F36F4C7fAc21B01bF0c56776CfB24538"
          />
          <RowColumn item="Duration of ownership" value="2 Month" />
          <RowColumn item="Last UPdate" value="Jan 12.2024" />
          <RowColumn item="Blockchain" value="Solana" />
          <RowColumn item="Project royalty" value="10%" />
          <RowColumn item="Token id" value="0x1a2b3c4d5e6f7g8h9i0" />
          <RowColumn item="Token URL" value="https://yourproject.com/nft/123" />
          <RowColumn item="Token standard" value="ERC-721" />
        </div>
      </div>
    ),
    intents: [
      <Button value={"back"} action="/">
        ←
      </Button>,
      <Button.Reset>Etherscan</Button.Reset>,
    ],
  });
});

app.route("/summary", summaryApp);

devtools(app, { serveStatic });
