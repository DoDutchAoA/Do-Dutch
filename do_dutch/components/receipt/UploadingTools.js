import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

const options = {
  title: "New Receipt",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose from gallery",
  quality: 1
};

export function loadPhoto(loadedCallback, uploadedCallback) {
  ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else {
      let source = { uri: response.uri };
      loadedCallback(source, response.data, true);
      uploadPhoto(response.data, uploadedCallback);
    }
  });
}

export function uploadPhoto(data, uploadedCallback) {
  RNFetchBlob.fetch(
    "POST",
    "http://52.12.74.177:5000/upload",
    {
      "Content-Type": "multipart/form-data"
    },
    [
      {
        name: "image",
        filename: window.user_id + "image.png",
        type: "image/png",
        data: data
      }
    ]
  )
    .then(resp => {
      console.log("upload successfully!");
      console.log(resp);
      console.log("========");
      console.log(JSON.parse(resp.data).items);

      let parsedData = JSON.parse(resp.data);
      let receiptData = parsedData.items;
      for (let i = 0; i < receiptData.length; i++) {
        receiptData[i]["icon"] = "file";
        receiptData[i]["name"] = receiptData[i]["display"];
        receiptData[i]["price"] = receiptData[i]["price"];
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

      uploadedCallback(receiptData, accumTotal, detectedTotal, timeStamp);
    })
    .catch(err => {
      console.error("Error: " + err);
    });
}
