module.exports = async ({ context, enqueue }) => {
  let { parseWithCheerio, request } = context;
  const $ = await parseWithCheerio();
  const mainObj = JSON.parse($("#__NEXT_DATA__").text())["props"]["pageProps"][
    "componentProps"
  ];
  const noOfItems = mainObj["listingSearchResultIds"].length;
  for (const key in mainObj.listingsMap) {
    if (Object.hasOwnProperty.call(mainObj.listingsMap, key)) {
      const currentCardData = mainObj.listingsMap[key];
      let currentCardUrl =
        "https://www.domain.com.au/" + currentCardData.listingModel.url;
      await enqueue({
        url: currentCardUrl,
        userData: {
          forefront: true,
        },
        label: "DETAIL",
      });
    }
  }
  // for (let i = 0; i <= noOfItems; i++) {
  //   let currentCard = mainObj["listingSearchResultIds"][i];
  //   let currentCardData = mainObj.listingsMap[currentCard];
  //   let currentCardUrl =
  //     "https://www.domain.com.au/" + currentCardData.listingModel.url;
  //   await enqueue({
  //     url: currentCardUrl,
  //     userData: {
  //       forefront: true,
  //     },
  //     label: "DETAIL",
  //   });
  // }
};
