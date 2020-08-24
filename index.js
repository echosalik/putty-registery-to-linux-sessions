const fs = require("fs");
const pj = require("./package.json");

if(typeof process.argv[2] === "undefined" && process.argv[2] !== "-h"){
  console.error("Path of Registory is required");
  console.log("example: node index.js ~/XYZ.reg")
  return;
}
if(process.argv[2] === "-h"){
  console.log("putty-registery-to-linux-sessions");
  console.log(` Version:    v${pj.version}`)
  console.log(` Created by: ${pj.author}\n`);
  console.log("  -h    prints this help text");
  console.log("  -r    replace ppk location with a different location.");
  console.log("        This is usefull if you have al your keys in one location.");
  console.log("        Example: -r C:/users/john.doe/.ssh:/media/BackUp/sshkeys/");
  console.log("                    ^ string to replace    ^ replacement string");
  console.log("        Please Note: All back slashes are converted to forward slashes in reg");
  console.log("        file while matching. For windows path, use forward slashes only.");
  return;
}

let reg = fs.readFileSync(process.argv[2]).toString("utf16le").split("\r\n");
let i = 0;
let writable = "";
let replace = false;
let replacee = null;
let replacer = null;

if(process.argv.indexOf("-r") !== -1){
  replace = true;
  let i = process.argv.indexOf("-r")+1;
  let matcher = process.argv[i].split(":");
  replacee = matcher[0];
  replacer = matcher[1];
}

if(!fs.existsSync("./sessions")){
  fs.mkdirSync("./sessions");
}

while(i < reg.length){
  if(reg[i].startsWith("[HKEY_CURRENT_USER\\Software\\SimonTatham\\PuTTY\\Sessions\\")){
    let path = (reg[i].replace("[", "").replace("]", "")).split("\\");
    let session_name = decodeURIComponent(path[path.length-1]).replace(/\s/igm, "");
    i += 1;
    while(!reg[i].startsWith("[")){
      let item = reg[i].replace(/"/igm, "");
      if(item.startsWith("Font")){
        i += 1;
        continue;
      }
      if(item.indexOf("dword") !== -1){
        let ex = item.split("=");
        let b = parseInt(ex[1].split(":")[1], 16);
        item = `${ex[0]}=${b}`;
      }
      if(item.startsWith("PublicKeyFile") && replace){
        item = item.replace(/\\\\/igm, "/");
        item = item.replace(replacee, replacer);
      }
      writable += item+"\n";
      i += 1;
    }
    fs.writeFileSync(`${process.cwd()}/sessions/${session_name}`, writable);
    writable = "";
    i -= -1;
  }else{
    i += 1;
  }
}