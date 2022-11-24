async function loadButtons(client) {
    const { fileLoader } = require("../functions/fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii("Buttons List");
  
    const Files = await fileLoader("Buttons");
  
    Files.forEach((file) => {
      const button = require(file);
      if (!button.id) return;
      
      client.buttons.set(button.id, button);
      table.setHeading(`Button`, `Status`);
      table.addRow(`${button.id}`, "🟩");
    });
  
    return console.log(table.toString(), "\nButtons Loaded")
  }
  
  module.exports = { loadButtons };
  