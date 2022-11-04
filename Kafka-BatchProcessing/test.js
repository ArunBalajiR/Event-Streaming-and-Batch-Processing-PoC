const { generateSlug } = require('random-word-slugs'); 
const moment = require('moment');
function produceBatch(){
    const batch = [];
    for(var i=0;i<5;i++){
        const songID = Math.floor(Math.random()*1024)+1;
        const songTitle = getRandomWord();
        const songInfo = { songID, songTitle};
        batch.push(songInfo);
    }
    return batch;
    
}

function getRandomWord() {
    const slug = generateSlug(4, { format: "title" });
    return slug;
}

for(var i=0;i<1;i++){
    let myList = produceBatch();
    console.log("Before Process "+JSON.stringify(myList,null, '\t'));
    processtheBatch(myList);
}

async function processtheBatch(arr){
    await arr.forEach(batchItem => {
        batchItem.album = generateSlug(1, {format: "title"});
        batchItem.releaseDate = moment().format('ll'); 
        batchItem.lastUpdated = moment();
    });
    console.log("Processed : "+JSON.stringify(arr, null, '\t'));
}
