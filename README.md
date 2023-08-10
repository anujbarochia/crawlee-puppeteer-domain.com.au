
# Web Scraping Project (domain.com.au)



![GitHub last commit](https://img.shields.io/github/last-commit/anujbarochia/crawlee-puppeteer-domain.com.au)


Welcome to the **Domain.com.au (Web Scraping Project)** repository! This project demonstrates web scraping techniques to extract data from the domain.com.au website, a platform for real estate listings in Australia. The scraped data can be used for various purposes, such as analysis, research, or data visualization, within the bounds of the website's terms of use.

## Features

- Utilizes **Node.js** and libraries like **Crawlee** and npm packages such as **puppeteer-extra, puppeteer-extra-plugin-stealth, csv-writer.**
- Scrapes property listings, prices, details, and other information, take a look at  [**csv-headers**](https://github.com/anujbarochia/crawlee-puppeteer-domain.com.au/blob/master/csv-headers.js) files for more scraped information.


## Run Locally

Follow these steps to set up and run the scraping script locally:

1. Clone this repository: `git clone https://github.com/anujbarochia/crawlee-puppeteer-domain.com.au`
2. Navigate to the project directory: `cd crawlee-puppeteer-domain.com.au`
3. Install the required Node.js packages: `npm install`
4. Create `.env` file in your project directory, you will need to enter 3 variables that are being used in this project (if you wish you can change the way program uses it & apply your own logic)
````
PROXY =""
MANUAL_CAPTCHA = "0"
CRAWLEE_CHROME_EXECUTABLE_PATH = ""
````
    PROXY => This variable takes takes a url from where you are accessing your pool of new proxy address when the website blocks your IP, crawlee will automatically take new proxy address from this pool
    MANUAL_CAPTCHA => Refer to index.js and have a look at the code for better understanding on how it is being used.
    CRAWLEE_CHROME_EXECUTABLE_PATH => By default our process would use chromium as a browser but here we are explicitly defining Chrome to be used as the browser, change the path address as per the location in your system, to find executable path type `chrome://version` in the search bar of chrome-in there you will be able to see a variable defined as Executable Path.

5. Run the scraping script: `node index.js`
6. Enjoy and feel free to make changes as per your requirement.




## Contributing

Contributions and suggestions are encouraged! If you encounter issues, have enhancement ideas, or wish to contribute, feel free to open an issue or submit a pull request.

## Warning 
**Please exercise caution and adhere to domain.com.au's terms of use and scraping guidelines when using this script.**

**Disclaimer:** This project is intended for educational and personal use only. The author and contributors are not responsible for any misuse of the scraping code or the data collected.

**Note:** Web scraping activities should always be carried out responsibly, respecting the website's terms of use and applicable laws and regulations.

