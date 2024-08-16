
import NftCard from "./NftCard";

type NftGroupsProps = {
  nftNum: number;
  state: any[]; // Define the type of state more specifically if possible
};

const NftGroups = ({ nftNum, state }: NftGroupsProps) => {
  
//console.log(state[0].metadata.init.tokens)
 //console.log(state[0])
  if (state?.length === 0) {
    return <div>No NFTs found.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        borderRadius: "20px",
        gap: "53px",
        width: "100%",
        height: "55%",
        alignItems: "center",
        padding: "2% 3% 0 2%",
      }}
    >
      {(() => {
        // Determine the start and end indices
        const start = Math.min(Math.max(0, nftNum - 1), Math.max(0, state?.length - 4));
        const end = Math.min(state?.length, start + 4);

        return state?.slice(start, 2).map((nft: any, index: number) => {
          const actualIndex = start + index; // Calculate the actual index in the original array
          let hover =
            actualIndex === nftNum
              ? "0px 0 40px rgba(235, 232, 232, 0.8)"
              : "0 0 0 rgba(235, 232, 232, 0.8)";

          return (
            <NftCard
              key={actualIndex}
              imgUrl={nft.metadata?.init?.tokens[0].image_url}
              nftId={nft.metadata.init.tokens.id}
              nftTitle={"nft.title"}
              hover={hover}
            />
          );
        });
      })()}
    </div>
  );
};

export default NftGroups;
