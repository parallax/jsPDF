//IE Fix, src: https://www.reddit.com/r/programminghorror/comments/6abmcr/nodelist_lacks_foreach_in_internet_explorer/
if (typeof(NodeList.prototype.forEach)!==typeof(alert)){
    NodeList.prototype.forEach=Array.prototype.forEach;
}