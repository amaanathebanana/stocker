# Stocker
#### Video Demo: https://youtube.com/watch?v=BUV7VIAUqmo
#### Description: A discord bot designed for paper trading! Paper trading is like trading stocks, however with virtual money instead of real money. 
#### My Files: I have a command handler designed by Lyxcode, however all the other files are mine. I chose MongoDB as my database because it's the most common database for most discord bots and has great documentation that I can use incase I get stuck.

##### Balance: Balance is a command which shows you how much money you currently have. So first in balance, I check if the user has a registered account open. If they do not I prompt them to register an account before trying this. If they do have an account, I ask mongodb for the table where userId is interaction.user.id, which is the user who ran the command. Then it returns their balance and preferred currency. I convert the balance into their preferred currency via a library called 'currency-converter-lt' which I found via the npmjs.com website. After I convert it I display it to the user.

##### Buy: Buy allows you to buy stocks. So first I contacted the IEX api and got the latest stock price. Then I convert the price to their preferred currency. After that I check if they have enough money to buy it. If they do I subtract their cash and make an entry to the stock database which shows that they own that stock.

##### Sell: Sell allows you to sell the stocks that you bought with /buy. Like /buy it contacts the api and gets the price. Then it checks if you have the amount of stocks you're trying to sell. If you do it edits or removes your entry from the stock database, and then updates your cash. 

##### Currency: Currency is my twist to Stocker. You can set a preferred currency that you want to be shown to you. First I copied a currency array from https://www.html-code-generator.com/javascript/json/currency-name. Then I checked if the users input was in that array. If it was I updated the users database and changed currency to be the new input.

##### Register: Register is the simplest command. It checks if you have an account and if you don't it creates a new entry in the users database, and sets your currency to USD by default.

##### Lookup: First it queries the api asking for the details about the stock. Then it gets the response and converts the price to the preferred currency and after that it replies with the price.

##### Stocks: It queries the database for all the stocks that you own and then makes a loop, which adds entries to the discord message with the converted price and a total for all the stocks you own.

##### MongoDB. I used two schemas in MongoDB to store the stocks that were currently owned and the users cash
