async function main() {
  const CollateralToken = await ethers.getContractFactory("CollateralToken");
  const collateralToken = await CollateralToken.deploy(
    "Collateral Token",
    "CAT"
  );
  await collateralToken.deployed();
  console.log("collateralToken deployed to: ", collateralToken.address);

  const Hub = await ethers.getContractFactory("Hub");
  const hub = await Hub.deploy();
  await hub.deployed();
  console.log("hub deployed to: ", hub.address);

  saveFrontendFiles(hub, collateralToken);
}

function saveFrontendFiles(hub, collateralToken) {
  const fs = require("fs");

  const addressDir = __dirname + `/../info`;
  const abiDir = __dirname + `/../info`;

  if (!fs.existsSync(addressDir)) {
    fs.mkdirSync(addressDir);
  }
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  fs.writeFileSync(
    addressDir + "/hub-address.json",
    JSON.stringify({ Hub: hub.address }, undefined, 2)
  );
  const HubArtifact = artifacts.readArtifactSync("Hub");
  fs.writeFileSync(abiDir + "/Hub.json", JSON.stringify(HubArtifact, null, 2));

  fs.writeFileSync(
    addressDir + "/collateral-token-address.json",
    JSON.stringify({ CollateralToken: collateralToken.address }, undefined, 2)
  );
  const CollateralTokenArtifact = artifacts.readArtifactSync("CollateralToken");
  fs.writeFileSync(
    abiDir + "/CollateralToken.json",
    JSON.stringify(CollateralTokenArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
