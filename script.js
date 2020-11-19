INIT_BIOMES = ["unassigned", "Mushroom", "Hallow", "Jungle", "Snow", "Ocean", "Desert", "Underground", "Forest"];

class Biome {
  constructor(type, original = false) {
    this.name = type + "-" + Biome.biomes.length;
    this.type = type;
    this.rooms = {};

    Biome.biomes.push(this);

    this.div = document.createElement("div");
    this.div.className = "biome";
    this.div.id = this.name;
    this.div.addEventListener("drop", drop_handler);
    this.div.addEventListener("dragover", dragover_handler);
    this.div.addEventListener("dragleave", dragleave_handler);
    var container = document.createElement("DIV");
    container.className = "biomeContainer";
    container.appendChild(this.div);
    switch (type) {
      case "unassigned":
      container.style.order = 0;
      break;
      case "Mushroom":
      container.style.order = 1;
      break;
      case "Hallow":
      container.style.order = 2;
      break;
      case "Jungle":
      container.style.order = 3;
      break;
      case "Snow":
      container.style.order = 4;
      break;
      case "Ocean":
      container.style.order = 5;
      break;
      case "Desert":
      container.style.order = 6;
      break;
      case "Underground":
      container.style.order = 7;
      break;
      case "Forest":
      container.style.order = 8;
      break;
    }
    if (this.type != "unassigned") {
      this.div.style.backgroundImage = "url(res/biomes/" + this.type + ".png)";
      var plus = document.createElement("INPUT");
      plus.type = "image";
      plus.className = "plusIcon";
      if (original){
        plus.src = "res/plus.png";
        plus.alt = "Add new " + this.type;
        plus.addEventListener("click", plusClick_handler);
      } else {
        plus.src = "res/minus.png";
        plus.alt = "Delete biome";
        plus.addEventListener("click", minusClick_handler);
      }
      this.div.appendChild(plus);
    } else {
      container.style.paddingTop = 0;
      this.div.style.position = "relative";
    }
    document.getElementById("main").appendChild(container);
  }
  delete() {
    var NPCs = this.inBiome();
    for (var i = 0; i < NPCs.length; i++) {
      NPC.byId(NPCs[i]).move("unassigned-0", "0-unassigned-0");
    }
    this.div.parentElement.remove();
  }
  static biomes = [];
  static byId(id) {
    for (var i = 0; i < Biome.biomes.length; i++) {
      if (id == Biome.biomes[i].name) return Biome.biomes[i];
    }
  }
  static byType(type) {
    for (var i = 0; i < Biome.biomes.length; i++) {
      if (type == Biome.biomes[i].type) return Biome.biomes[i];
    }
  }
  addNPC(room, name) {
    if (room == "new-room") room = this.addRoom();
    this.rooms[room].push(name);
    return room
  }
  removeNPC(room, name) {
    for (var i = 0; i < this.rooms[room].length; i++) {
      if (name == this.rooms[room][i]) {
        this.rooms[room].splice(i, 1);
        if (this.rooms[room].length == 0) {
          document.getElementById(room).remove();
        }
        return
      }
    }
  }
  addRoom() {
    var roomId = Object.keys(this.rooms).length.toString() + "-" + this.name;
    this.rooms[roomId] = [];
    var room = document.createElement("div");
    room.className = "room";
    room.id = roomId;
    room.addEventListener("drop", drop_handler);
    room.addEventListener("dragover", dragover_handler);
    room.addEventListener("dragleave", dragleave_handler);
    this.div.appendChild(room);

    return roomId;
  }
  inRoom(roomId) {
    return this.rooms[roomId];
  }
  inBiome() {
    var npcs = [];
    for (var room in this.rooms) {
      npcs = npcs.concat(this.rooms[room]);
    }
    return npcs;
  }
};

class Connection {
  constructor(A, B) {
    this.A = NPC.byId(A);
    this.B = NPC.byId(B);

    var ARect = this.A.dom.getBoundingClientRect();
    var BRect = this.B.dom.getBoundingClientRect();
    var svgRect = Connection.svg.getBoundingClientRect();
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.setAttributeNS(null, "x1", ARect.x + ARect.width / 2 - svgRect.x);
    this.line.setAttributeNS(null, "y1", ARect.y + ARect.height / 2 - svgRect.y);
    this.line.setAttributeNS(null, "x2", BRect.x + BRect.width / 2 - svgRect.x);
    this.line.setAttributeNS(null, "y2", BRect.y + BRect.height / 2 - svgRect.y);
    Connection.svg.appendChild(this.line);

    Connection.connections.push(this);
  }
  static svg = document.getElementById("connections");
  static connections = [];
  static active = false;
  static A = undefined;
  static byNPCs(A, B) {
    for (var i = 0; i < Connection.connections.length; i++) {
      if (A == Connection.connections[i].A.name || A == Connection.connections[i].B.name) {
        if (B == Connection.connections[i].A.name || B == Connection.connections[i].B.name) {
          return Connection.connections[i];
        }
      }
    }
    return false;
  }
  static byNPC(A) {
    var c = []
    for (var i = 0; i < Connection.connections.length; i++) {
      if (A == Connection.connections[i].A.name || A == Connection.connections[i].B.name) {
        c.push(Connection.connections[i]);
      }
    }
    return c;
  }
  static toNPC(A) {
    var c = []
    for (var i = 0; i < Connection.connections.length; i++) {
      if (A == Connection.connections[i].A.name || A == Connection.connections[i].B.name) {
        if (A == Connection.connections[i].A.name) c.push(Connection.connections[i].B.name);
        else c.push(Connection.connections[i].A.name);
      }
    }
    return c;
  }
  static start(A) {
    if (Connection.A) NPC.byId(Connection.A).dom.style.filter = "";
    if (Connection.A == A) Connection.A = null;
    else {
      Connection.A = A;
      NPC.byId(A).dom.style.filter = "drop-shadow(0px 0px 3px lightblue)";
    }
  }
  static end(B) {
    if (Connection.A != B) {
      var c = Connection.byNPCs(Connection.A, B)
      if (c) {
        c.delete();
      } else new Connection(Connection.A, B);
    } else {
      var c = Connection.byNPC(B);
      for (var i = 0; i < c.length; i++) {
        c[i].delete();
      }
    }

    NPC.byId(Connection.A).dom.style.filter = "";
    NPC.byId(Connection.A).updateHappiness();
    NPC.byId(B).updateHappiness();
    Connection.A = null;
  }
  static refreshAll() {
    for (var i = 0; i < Connection.connections.length; i++) {
      Connection.connections[i].refresh();
    }
  }
  delete() {
    Connection.svg.removeChild(this.line);
    for (var i = 0; i < Connection.connections.length; i++) {
      if (this == Connection.connections[i]) {
        Connection.connections.splice(i, 1);
      }
    }
  }
  refresh() {
    var ARect = this.A.dom.getBoundingClientRect();
    var BRect = this.B.dom.getBoundingClientRect();
    var svgRect = Connection.svg.getBoundingClientRect();
    this.line.setAttributeNS(null, "x1", ARect.x + ARect.width / 2 - svgRect.x);
    this.line.setAttributeNS(null, "y1", ARect.y + ARect.height / 2 - svgRect.y);
    this.line.setAttributeNS(null, "x2", BRect.x + BRect.width / 2 - svgRect.x);
    this.line.setAttributeNS(null, "y2", BRect.y + BRect.height / 2 - svgRect.y);
  }
}

class NPC {
  constructor(id, biomePreference, NPCPreference) {
    this.name = id;
    this.NPCPreference = NPCPreference;
    this.biomePreference = biomePreference;
    this.biomeHappiness = 1;
    this.roomieHappiness = [];
    this.roomHappiness = 1;
    this.crowdedHappiness = 1;
    this.peacefulHappiness = 1;
    this.happiness = 1;
    this.actualHappiness = 1;

    NPC.NPCs.push(this);

    this.dom = document.createElement("DIV");
    this.dom.id = this.name;
    this.dom.className = "NPC";
    this.dom.draggable = "true";
    var img = document.createElement("IMG");
    img.src = "res/NPCs/" + this.name + ".png";
    img.alt = this.name;
    img.addEventListener("dragstart", dragstart_handler);
    img.addEventListener("dragend", dragend_handler);
    img.addEventListener("mouseover", mouse_handler);
    img.addEventListener("click", mouse_handler);
    img.addEventListener("contextmenu", contextmenu_handler);
    img.addEventListener("dblclick", contextmenu_handler);
    this.dom.appendChild(img);
    this.happinessLabel = document.createElement("P");
    this.happinessLabel.className = "happinessLabel";
    this.happinessLabel.innerHTML = this.actualHappiness;
    this.dom.appendChild(this.happinessLabel);

    this.infoCard = document.createElement("DIV");
    this.infoCard.id = id + " infoCard";
    this.infoCard.className = "infoCard";
    document.getElementById("happinessStats").appendChild(this.infoCard);

    this.move("unassigned-0", "0-unassigned-0");
  }
  static NPCs = [];
  static byId(id) {
    for (var i = 0; i < NPC.NPCs.length; i++) {
      if (id == NPC.NPCs[i].name) return NPC.NPCs[i];
    }
  }
  move(biomeId, room) {
    if (this.roomId == room) return;

    var neighbours = this.neighbours();
    if (this.roomId) Biome.byId(this.biomeId).removeNPC(this.roomId, this.name);

    room = Biome.byId(biomeId).addNPC(room, this.name);
    this.biomeId = biomeId;
    this.roomId = room;
    document.getElementById(room).appendChild(this.dom);
    neighbours = neighbours.concat(this.neighbours());
    for (var i = 0; i < neighbours.length; i++) {
      NPC.byId(neighbours[i]).updateHappiness();
    }
    this.updateHappiness();
    Connection.refreshAll();
    //stats();
  }
  updateHappiness() {
    this.biomeHappiness = this.biomeRelation(Biome.byId(this.biomeId).type);
    var roomies = this.roomies();
    var neighbours = this.neighbours();
    this.roomHappiness = 1;
    this.roomieHappiness = [];
    for (var i = 0; i < roomies.length; i++) {
      this.roomieHappiness.push(this.NPCRelation(roomies[i]));
      this.roomHappiness *= this.roomieHappiness[i];
    }
    this.crowdedHappiness = roomies.length >= 3 ? 1.05**(roomies.length - 2) : 1;
    this.peacefulHappiness = (neighbours.length - roomies.length <= 3 && roomies.length <= 2) ? 0.95 : 1;

    this.happiness = this.biomeHappiness * this.roomHappiness * this.crowdedHappiness * this.peacefulHappiness;

    if (this.happiness > 1.5) this.actualHappiness = 1.5;
    else if (this.happiness < 0.75) this.actualHappiness = 0.75;
    else this.actualHappiness = Math.round(this.happiness*100) / 100;

    this.updateInfoCard();
  }
  updateInfoCard() {
    if (this.biomeId == "unassigned-0") {
      this.infoCard.style.display = "none";
      return
    }

    var NPCs = [];
    var shift = 0;
    var inserted = false;
    for (var i = 0; i < NPC.NPCs.length; i++) {
      if (
        NPC.NPCs[i].name == this.name) {
        shift--;
        continue
      };
      if (this.happiness < NPC.NPCs[i].happiness && !inserted) {
        NPCs.push(this);
        this.infoCard.style.order = i + shift;
        shift++;
        inserted = true;
      }
      NPCs.push(NPC.NPCs[i]);
      NPCs[i+shift].infoCard.style.order = i + shift;
    }
    if (!inserted) {
      NPCs.push(this);
      this.infoCard.style.order = i + shift;
    }
    NPC.NPCs = NPCs;

    this.infoCard.style.display = "";
    var biome = Biome.byId(this.biomeId).type;
    var biomeInfo = this.biomeHappiness != 1 ? `<p>×<span class="${this.biomeHappiness < 1 ? "good" : "bad"}">${this.biomeHappiness}</span> (${biome})</p>` : "";
    var roomies = this.roomies();
    var roomieInfo = "";
    for (var j = 0; j < roomies.length; j++) {
      roomieInfo += this.roomieHappiness[j] != 1 ? `<p>×<span class="${this.roomieHappiness[j] < 1 ? "good" : "bad"}">${this.roomieHappiness[j]}</span> (${roomies[j]})</p>` : "";
    }
    var crowdedInfo =  this.crowdedHappiness != 1 ? `<p>×<span class="bad">${this.crowdedHappiness.toFixed(2)}</span> (${roomies.length-2} too many roommates)</p>` : "";
    var peacefulInfo = this.peacefulHappiness != 1 ? "<p>×<span class=\"good\">0.95</span> (Peacful surroundings)</p>" : "";

    this.infoCard.innerHTML = `
      <div class="statIcon" id="${this.name}">
        <img src="res/NPCs/${this.name}.png" alt="${this.name}" onmouseover="mouse_handler(event)" onclick="mouse_handler(event)">
      </div>
      <div class="statInfo">
        <p style="font-weight: 600;">${this.name}</p>
        ${biomeInfo}
        ${roomieInfo}
        ${crowdedInfo}
        ${peacefulInfo}
        <p style="border-top: 1px solid lightgray;">=${this.happiness.toFixed(4)} overall (${this.actualHappiness} effectively)</p>
      </div>
      `
      this.happinessLabel.innerHTML = this.actualHappiness;
  }
  biomeRelation(biomeType) {
    for (var i = 0; i < this.biomePreference.name.length; i++) {
      if (biomeType == this.biomePreference.name[i]) return this.biomePreference.relation[i];
    }
    return 1;
  }
  NPCRelation(NPC) {
    for (var i = 0; i < this.NPCPreference.name.length; i++) {
      if (NPC == this.NPCPreference.name[i]) return this.NPCPreference.relation[i];
    }
    return 1;
  }
  roomies() {
    var npcs = Biome.byId(this.biomeId).inRoom(this.roomId);
    var others = [];
    var explicit = Connection.toNPC(this.name);
    for (var i = 0; i < npcs.length; i++) {
      if (npcs[i] != this.name) others.push(npcs[i]);
      for (var j = 0; j < explicit.length; j++) {
        if (npcs[i] == explicit[j]) explicit.splice(j, 1);
      }
    }
    return others.concat(explicit);
  }
  neighbours() {
    if (!this.biomeId) return [];
    var npcs = Biome.byId(this.biomeId).inBiome();
    var others = [];
    var explicit = Connection.toNPC(this.name);
    for (var i = 0; i < npcs.length; i++) {
      if (npcs[i] != this.name) others.push(npcs[i]);
      for (var j = 0; j < explicit.length; j++) {
        if (npcs[i] == explicit[j]) explicit.splice(j, 1);
      }
    }
    return others.concat(explicit);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const biomeDivs = document.getElementsByClassName("biome");
  for (var i = 0; i < INIT_BIOMES.length; i++) {
    new Biome(INIT_BIOMES[i], true);
  }
  Biome.byId("unassigned-0").addRoom();

  new NPC("Angler",           {name: ["Ocean","Desert"], relation: [0.94,1.06]},        {name: ["Princess", "Demolitionist","Party Girl","Tax Collector","Tavernkeep"], relation: [0.94, 0.94,0.94,0.94,1.12]});
  new NPC("Arms Dealer",      {name: ["Desert","Snow"], relation: [0.94,1.06]},         {name: ["Princess", "Nurse", "Steampunker", "Golfer", "Demolitionist"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Clothier",         {name: ["Underground","Hallow"], relation: [0.94,1.06]},  {name: ["Princess", "Truffle", "Tax Collector", "Nurse", "Mechanic"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Cyborg",           {name: ["Snow","Jungle"], relation: [0.94,1.06]},         {name: ["Princess", "Steampunker", "Pirate", "Stylist", "Zoologist", "Wizard"], relation: [0.94, 0.94, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Demolitionist",    {name: ["Underground","Ocean"], relation: [0.94,1.06]},   {name: ["Princess", "Tavernkeep", "Mechanic", "Arms Dealer", "Goblin Tinkerer"], relation: [0.94, 0.88, 0.94, 1.06, 1.06]});
  new NPC("Dryad",            {name: ["Jungle","Desert"], relation: [0.94,1.06]},       {name: ["Princess", "Witch Doctor", "Truffle", "Angler", "Golfer"], relation: [0.94, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Dye Trader",       {name: ["Desert","Forest"], relation: [0.94,1.06]},       {name: ["Princess", "Arms Dealer", "Painter", "Steampunker", "Pirate"], relation: [0.94, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Goblin Tinkerer",  {name: ["Underground","Jungle"], relation: [0.94,1.06]},  {name: ["Princess", "Mechanic", "Dye Trader", "Clothier", "Stylist"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Golfer",           {name: ["Forest","Underground"], relation: [0.94,1.06]},  {name: ["Princess", "Angler", "Painter", "Zoologist", "Pirate", "Merchant"], relation: [0.94, 0.88, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Guide",            {name: ["Forest","Ocean"], relation: [0.94,1.06]},        {name: ["Princess", "Clothier", "Zoologist", "Steampunker", "Painter"], relation: [0.94, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Mechanic",         {name: ["Snow","Underground"], relation: [0.94,1.06]},    {name: ["Princess", "Goblin Tinkerer", "Cyborg", "Arms Dealer", "Clothier"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Merchant",         {name: ["Forest","Desert"], relation: [0.94,1.06]},       {name: ["Princess", "Golfer", "Nurse", "Tax Collector", "Angler"], relation: [0.94, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Nurse",            {name: ["Hallow","Snow"], relation: [0.94,1.06]},         {name: ["Princess", "Arms Dealer", "Wizard", "Dryad", "Party Girl", "Zoologist"], relation: [0.94, 0.88, 0.94, 1.06, 1.06, 1.12]});
  new NPC("Painter",          {name: ["Jungle","Forest"], relation: [0.94,1.06]},       {name: ["Princess", "Dryad", "Party Girl", "Truffle", "Cyborg"], relation: [0.94, 0.88, 0.94, 1.06, 1.06]});
  new NPC("Party Girl",       {name: ["Hallow","Underground"], relation: [0.94,1.06]},  {name: ["Princess", "Wizard", "Zoologist", "Stylist", "Merchant", "Tax Collector"], relation: [0.94, 0.88, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Pirate",           {name: ["Ocean","Underground"], relation: [0.94,1.06]},   {name: ["Princess", "Angler", "Tavernkeep", "Stylist", "Guide"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Princess",         {name: [], relation: []},                                 {name: ["Angler", "Arms Dealer", "Clothier", "Cyborg", "Demolitionist", "Dryad", "Dye Trader", "Goblin Tinkerer", "Golfer", "Guide", "Mechanic", "Merchant", "Nurse", "Painter", "Party Girl", "Pirate", "Santa Claus", "Steampunker", "Stylist", "Tavernkeep", "Tax Collector", "Truffle", "Witch Doctor", "Wizard", "Zoologist"], relation: [0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88, 0.88]});
  new NPC("Santa Claus",      {name: ["Snow","Desert"], relation: [0.88,1.12]},         {name: ["Princess", "Tax Collector"], relation: [0.94, 1.12]});
  new NPC("Steampunker",      {name: ["Desert","Jungle"], relation: [0.94,1.06]},       {name: ["Princess", "Cyborg", "Painter", "Dryad", "Wizard", "Party Girl"], relation: [0.94, 0.88, 0.94, 1.06, 1.06, 1.06]});
  new NPC("Stylist",          {name: ["Ocean","Snow"], relation: [0.94,1.06]},          {name: ["Princess", "Dye Trader", "Pirate", "Tavernkeep", "Goblin Tinkerer"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Tavernkeep",       {name: ["Hallow","Snow"], relation: [0.94,1.06]},         {name: ["Princess", "Demolitionist", "Goblin Tinkerer", "Guide", "Dye Trader"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Tax Collector",    {name: ["Snow","Hallow"], relation: [0.94,1.06]},         {name: ["Princess", "Merchant", "Party Girl", "Demolitionist", "Mechanic", "Santa Claus"], relation: [0.94, 0.88, 0.94, 1.06, 1.06, 1.12]});
  new NPC("Truffle",          {name: ["Mushroom"], relation: [0.94,1.06]},              {name: ["Princess", "Guide", "Dryad", "Clothier", "Witch Doctor"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Witch Doctor",     {name: ["Jungle","Hallow"], relation: [0.94,1.06]},       {name: ["Princess", "Dryad", "Guide", "Nurse", "Truffle"], relation: [0.94, 0.94, 0.94, 1.06, 1.12]});
  new NPC("Wizard",           {name: ["Hallow","Ocean"], relation: [0.94,1.06]},        {name: ["Princess", "Golfer", "Merchant", "Witch Doctor", "Cyborg"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
  new NPC("Zoologist",        {name: ["Forest","Desert"], relation: [0.94,1.06]},       {name: ["Princess", "Witch Doctor", "Golfer", "Angler", "Arms Dealer"], relation: [0.94, 0.88, 0.94, 1.06, 1.12]});
});

function mouse_handler(e) {
  if (e.type == "click" && Connection.A) {
    Connection.end(e.target.parentElement.id);
  }
  stats(NPC.byId(e.target.parentElement.id));
}

function contextmenu_handler(e) {
  e.preventDefault();
  Connection.start(e.target.parentElement.id);
}

function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.parentElement.id);
  e.dataTransfer.dropEffect = "move";
}

function dragend_handler(e) {
  e.target.parentElement.style.borderColor = "";
}

function dragover_handler(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  this.style.borderColor = "orange";
}

function dragleave_handler(e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.borderColor = "";
}

function drop_handler(e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.border = "";
  const npc = NPC.byId(e.dataTransfer.getData("text/plain"));
  if (!npc) return;
  if (this.classList.contains("biome")) npc.move(this.id, "new-room");
  if (this.classList.contains("room")) {
    biomeId = this.parentElement.id;
    npc.move(biomeId,this.id);
  }
}

function plusClick_handler(e) {
  e.preventDefault();
  new Biome(Biome.byId(this.parentElement.id).type);
  Connection.refreshAll();
}

function minusClick_handler(e) {
  e.preventDefault();
  Biome.byId(this.parentElement.id).delete();
  Connection.refreshAll();
}

function stats(npc) {
  var biomeInfoLoves = "";
  var biomeInfoLikes = "";
  var biomeInfoDislikes = "";
  var biomeInfoHates = "";
  for (var i = 0; i < npc.biomePreference.name.length; i++) {
    switch (npc.biomePreference.relation[i]) {
      case 0.88:
      biomeInfoLoves += npc.biomePreference.name[i];
      break;
      case 0.94:
      biomeInfoLikes += npc.biomePreference.name[i];
      break;
      case 1.06:
      biomeInfoDislikes += npc.biomePreference.name[i];
      break;
      case 1.12:
      biomeInfoHates += npc.biomePreference.name[i];
      break;
    }
  }
  var NPCInfoLoves = "";
  var NPCInfoLikes = "";
  var NPCInfoDislikes = "";
  var NPCInfoHates = "";
  for (var i = 0; i < npc.NPCPreference.name.length; i++) {
    switch (npc.NPCPreference.relation[i]) {
      case 0.88:
      NPCInfoLoves += `<img class="NPCMiniIcon" src="res/NPCs/${npc.NPCPreference.name[i]}.png" alt="${npc.NPCPreference.name[i]}" />`;
      break;
      case 0.94:
      NPCInfoLikes += `<img class="NPCMiniIcon" src="res/NPCs/${npc.NPCPreference.name[i]}.png" alt="${npc.NPCPreference.name[i]}" />`;
      break;
      case 1.06:
      NPCInfoDislikes += `<img class="NPCMiniIcon" src="res/NPCs/${npc.NPCPreference.name[i]}.png" alt="${npc.NPCPreference.name[i]}" />`;
      break;
      case 1.12:
      NPCInfoHates += `<img class="NPCMiniIcon" src="res/NPCs/${npc.NPCPreference.name[i]}.png" alt="${npc.NPCPreference.name[i]}" />`;
      break;
    }
  }
  var card = document.getElementById("NPCStats");
  card.innerHTML = `
    <div class="statIcon">
      <img src="res/NPCs/${npc.name}.png">
    </div>
    <div class="statInfo">
      <div class="biomeStat">
        ${biomeInfoLoves ? `<div class="biomeStatCell">Loves (0.88)<br />${biomeInfoLoves}</div>` : ``}
        ${biomeInfoLikes ? `<div class="biomeStatCell">Likes (0.94)<br />${biomeInfoLikes}</div>` : ``}
        ${biomeInfoDislikes ? `<div class="biomeStatCell">Dislikes (1.06)<br />${biomeInfoDislikes}</div>` : ``}
        ${biomeInfoHates ? `<div class="biomeStatCell">Hates (1.12)<br />${biomeInfoHates}</div>` : ``}
      </div>
      <div class="NPCStat">
        ${NPCInfoLoves ? `<div class="NPCStatCell">Loves (0.88)<br />${NPCInfoLoves}</div>` : ``}
        ${NPCInfoLikes ? `<div class="NPCStatCell">Likes (0.94)<br />${NPCInfoLikes}</div>` : ``}
        ${NPCInfoDislikes ? `<div class="NPCStatCell">Dislikes (1.06)<br />${NPCInfoDislikes}</div>` : ``}
        ${NPCInfoHates ? `<div class="NPCStatCell">Hates (1.12)<br />${NPCInfoHates}</div>` : ``}
      </div>
    </div>
    `
}

function moveToPreferredBiome() {
  var NPCs = NPC.NPCs;
  for (var i = 0; i < NPCs.length; i++) {
    var npc = NPCs[i];
    var biome = Biome.byType(npc.biomePreference.name[0]);
    if (biome) npc.move(biome.name, "new-room");
  }
}
