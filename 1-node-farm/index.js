const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////////////////////////////
//FILES

//blocking synchronous way
// const textIn = fs.readFileSync("./starter/txt/input.txt", 'utf-8');
// console.log(textIn);
// const textOut =`   This is what we know about avocado: ${textIn}.\n Created on ${Date.now()}`
// fs.writeFileSync('./starter/txt/output.txt',textOut)
// console.log("File written");

//non-blocking asynchronous way
// fs.readFile('./starter/txt/start.txt' ,'utf-8', (err, data1)=>{
//     if(err) return console.log("Error 404");
//     fs.readFile(`./starter/txt/${data1}.txt` ,'utf-8', (err, data2)=>{
//         console.log(data2)
//         fs.readFile(`./starter/txt/append.txt` ,'utf-8', (err, data3)=>{
//             console.log(data3);
//             fs.writeFile('./starter/txt/final.txt',`${data2}\n ${data3}`,'utf-8',err=>{
//                 console.log("Your File is written")
//             })
//             })
//         })
// })
// console.log('will read file');

// const hello="Hello Ajay"
// console.log(hello)
////////////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const tempOverview = fs.readFileSync(
  "./final/templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync(
  "./final/templates/template-card.html",
  "utf-8"
);
const tempProduct = fs.readFileSync(
  "./final/templates/template-product.html",
  "utf-8"
);

const data = fs.readFileSync("./final/dev-data/data.json", "utf-8");

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  //Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

    res.end(output);
  }
  //Product Page
  else if (pathName === "/product") {
    res.end("HELLO from the Product");
  }
  //api Page
  else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  //Not Found Page
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Cannot be found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000 ");
});
