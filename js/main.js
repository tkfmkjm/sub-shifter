/*
////////////
Todo List
////////////

- make sure all of timestamps are following proper format, otherwise reject
- convert timestamp and input time into milli seconds
- count how many dialogues and put in variable
- make sure it work when shifted timestamp is the same as one of original timestamp


hours: [h,h, ... h,h]
minutes: [m,m ... ,m,m]
seconds: [s,s,... s,s]
milli seconds: [ms,ms, ... ms, ms]
input hh:mm:ss.ms ms ms

hours*60*60*100 = minutes*60*100 = seconds*100 = milli seconds

(h[0]*36000)+(m[0]*600)+(s[0]*100)+(ms[0])
(h[1]*36000)+(m[1]*600)+(s[1]*100)+(ms[1])
...
(h[4]*36000)+(m[4]*600)+(s[4]*100)+(ms[4])

*/

const downloadForm = document.querySelector('.download');
const file = document.querySelector('#file');
// const time = document.querySelector('#time');

//regex to verify srt file
let srtVerify = /\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/;

//regex to detect timestamp patterns
let hourPattern = /\d\d(?=:\d\d:\d\d,\d\d\d)/gm;
let minPattern = /(?<=\d\d:)\d\d(?=:\d\d,\d\d\d)/gm;
let secPattern = /(?<=\d\d:\d\d:)\d\d(?=,\d\d\d)/gm;
let millisecPattern = /(?<=\d\d:\d\d:\d\d,)\d\d\d/gm;

//original timestamps
let hourArray = [];
let minArray = [];
let secArray = [];
let millisecArray = [];

//timestamps after shifted
let hourArrayShifted = [];
let minArrayShifted = [];
let secArrayShifted = [];
let millisecArrayShifted = [];

//milli second before shifted
let millisecTotal = [];

//milli second after shifted
// let millisecTotalShifted = [];

//number of timestamps
let timestamps;

downloadForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // load file
  let fileToLoad = file.files[0];
  let fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    let textFromFileLoaded = fileLoadedEvent.target.result;
    // console.log('textFromFileLoaded: ' + textFromFileLoaded);
    let string = textFromFileLoaded;
    // console.log('string: ' + string);

    //Store in array
    if (string.match(srtVerify)) {
      console.log('It is a srt file');

      //input time
      let inputHour = Number(document.querySelector('#inputHour').value) * 100 * 60 * 60;
      let inputMin = Number(document.querySelector('#inputMinutes').value) * 60 * 100;
      let inputSec = Number(document.querySelector('#inputSeconds').value) * 100;
      let inputMilli = Number(document.querySelector('#inputMilli').value);
      let inputTotal = inputHour + inputMin + inputSec + inputMilli;

      hourArray = string.match(hourPattern);
      minArray = string.match(minPattern);
      secArray = string.match(secPattern);
      millisecArray = string.match(millisecPattern);

      //parsing string to number
      for (let i = 0; i < hourArray.length; i++) {
        millisecArray[i] = parseInt(millisecArray[i]); //converting to milli second by multiple by 100
        secArray[i] = parseInt(secArray[i]) * 100; //converting to milli second by multiple by 100
        minArray[i] = parseInt(minArray[i]) * 60 * 100; //converting to milli second by multiple by 100
        hourArray[i] = parseInt(hourArray[i]) * 60 * 60 * 100; //converting to milli second by multiple by 100

        millisecTotal[i] = millisecArray[i] + secArray[i] + minArray[i] + hourArray[i] + inputTotal;

        // console.log(secArray[i]);
        // console.log(typeof secArray[i]);
      }

      //checking number of object in the array
      // console.log('Array Length: ' + a.length);

      console.log(millisecTotal[3]);

    } else {
      console.log('It is not a srt file');
    }

    // save file
    // delete current element
    function destroyClickedElement(event) {
      document.body.removeChild(event.target);
    }
    // var for text to put in file
    let textToSave = string;

    // save file type as .txt
    let textToSaveAsBlob = new Blob([textToSave], {
      type: "text/plain"
    });
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    // var for file name
    let fileNameToSaveAs = 'file';
    // create an <a> tag
    let downloadLink = document.createElement("a");
    // set download file name of <a>
    downloadLink.download = fileNameToSaveAs;
    // set text of <a>
    downloadLink.innerHTML = "Download File";
    // set url of <a>
    downloadLink.href = textToSaveAsURL;
    // delete <a> after click
    downloadLink.onclick = destroyClickedElement;
    // set display of <a> to none
    downloadLink.style.display = "none";
    // add <a> to end of body
    document.body.appendChild(downloadLink);
    // click <a> to download file
    downloadLink.click();
  };
  // need this so the file reader knows when it is done reading the file
  // pretty troll I know
  fileReader.readAsText(fileToLoad, "UTF-8");
});