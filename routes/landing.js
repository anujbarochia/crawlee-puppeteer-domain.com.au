module.exports = async ({ context, enqueue }) => {
  let { parseWithCheerio, request } = context;
  const $ = await parseWithCheerio();
  const mainObj = JSON.parse($("#__NEXT_DATA__").text())["props"]["pageProps"][
    "componentProps"
  ];
  const totalPages = mainObj["totalPages"];
  //
  const url = request.url;
  const baseURL = url.replace("page=1", "");
  for (let i = 1; i <= totalPages; i++) {
    let dynamicURL = baseURL + `page=${i}`;
    await enqueue({
      url: dynamicURL,
      userData: {
        forefront: true,
      },
      label: "LIST",
    });
  }
};
