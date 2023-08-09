module.exports = async ({ context, pushData }) => {
  let { parseWithCheerio, request, page } = context;
  // If we had used puppeteer's page instance, then we could do as below
  // const data = await page.evalute(()=>{
  //   return JSON.parse($("#__NEXT_DATA__").text())["props"]["pageProps"]["componentProps"];
  // });
  const $ = await parseWithCheerio();
  const mainObj = JSON.parse($("#__NEXT_DATA__").text())["props"]["pageProps"][
    "componentProps"
  ];
  // dynamically extracted photos,agents,description

  let photos = mainObj.gallery.slides
    .filter((i) => i.mediaType == "image")
    .map((i) => i.images.original.url);

  //

  let agentData = mainObj["agents"];
  let agents = JSON.stringify(
    agentData.map((i) => {
      return {
        name: i.name,
        phoneNo: i.mobile,
        photoURL: i.photo,
        profileURL: i.agentProfileUrl,
      };
    })
  );

  //
  let description = mainObj.description.join("\n").trim();
  // let totallines = mainObj["description"].length;
  // for (let i = 0; i < totallines; i++) {
  //   description += `\n ${mainObj.description[i]}`;
  // }
  //
  const postCode = mainObj["postcode"];
  const url = mainObj["listingUrl"];
  const parking = mainObj["listingSummary"]["parking"];
  const address = mainObj["listingSummary"]["address"];
  const bedRooms = mainObj["listingSummary"]["beds"];
  const bathRooms = mainObj["listingSummary"]["baths"];
  const propertyType = mainObj["listingSummary"]["propertyType"];
  const propertySize = mainObj.listingSummary.stats.length
    ? mainObj.listingSummary.stats[0]["value"]
    : null;
  const latitude = mainObj["map"]["latitude"];
  const longitude = mainObj["map"]["longitude"];
  const descriptionTitle = mainObj["headline"];
  const agencyName = mainObj["priceGuide"]["agencyName"];
  const price = mainObj["listingSummary"]["price"];
  const result = {
    url,
    photos,
    postCode,
    address,
    price,
    parking,
    bathRooms,
    bedRooms,
    propertyType,
    propertySize,
    longitude,
    latitude,
    descriptionTitle,
    description,
    agencyName,
    agents,
  };
  await pushData(result).then("csv written");
};
