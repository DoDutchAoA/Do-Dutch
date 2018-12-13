import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

const serverURL = "http://52.12.74.177:5000/";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
const options = {
  title: "New Receipt",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose from gallery",
  quality: 1
};

let NetworkHelper = {
  uploadReceiptPhoto(loadedCallback, uploadedCallback) {
    ImagePicker.showImagePicker(options, selection => {
      if (selection.didCancel) { }
      else if (selection.error) { }
      else {
        let source = { uri: selection.uri };
        loadedCallback(source, selection.data, true);
        RNFetchBlob.fetch(
          "POST",
          serverURL + "upload",
          {
            "Content-Type": "multipart/form-data"
          },
          [
            {
              name: "image",
              filename: window.user_id + "image.png",
              type: "image/png",
              data: selection.data
            }
          ]
        )
          .then(response => {
            uploadedCallback(this.parseReceiptPackage(response.data));
          })
          .catch(err => {
            console.error("Error: " + err);
          });
      }
    });
  },

  parseReceiptPackage(data) {
    let parsedData = JSON.parse(data);
    let goods = parsedData.items;
    for (let i = 0; i < goods.length; i++) {
      goods[i]["icon"] = "file";
      goods[i]["name"] = goods[i]["display"];
      goods[i]["price"] = goods[i]["price"];
      goods[i]["split"] = true;
    }
    let accumTotal = parsedData.accumTotal;
    let detectedTotal = parsedData.detectedTotal;

    let time = new Date();
    let parsedTime = time.toString().split(" ");
    let timeStamp =
      parsedTime[1] +
      " " +
      parsedTime[2] +
      " " +
      time.getHours() +
      ":" +
      time.getMinutes();

    return {
      title: "Receipt Name",
      time: timeStamp,
      place: "Walmart",
      items: goods,
      accumTotal: "$" + accumTotal.toFixed(2).toString(),
      detectedTotal: "$" + detectedTotal.toFixed(2).toString(),
      image_url: parsedData.path,
      status: "Payer"
    };
  },

  uploadReceiptData(receipt) {
    fetch(serverURL + "newReceipt", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        sender: window.username,
        receiver: "sharer",
        receiptId: "someid",
        data: JSON.stringify(receipt)
      })
    });
  },

  beginPollingReceipt(interval, callback) {
    setInterval(() => {
      fetch(serverURL + "pollingReceipt", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          receiver: window.username
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          callback(responseJson);
        })
        .catch(error => {});
    }, interval);
  }
};

export default NetworkHelper;
