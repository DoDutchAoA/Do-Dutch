import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

const options = {
  title: "New Receipt",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose from gallery",
  quality: 1
};

export default photoTools (photoTools = {
  loadPhoto(loadedCallback, uploadedCallback) {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        let source = { uri: response.uri };
        loadedCallback(source, response.data, true);
        this.uploadPhoto(response.data, uploadedCallback);
      }
    });
  },

  uploadPhoto(data, uploadedCallback) {
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
        // console.log("upload successfully!");
        // console.log(resp);
        // console.log("========");
        // console.log(JSON.parse(resp.data).items);

        let parsedData = JSON.parse(resp.data);
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

        let receiptRecord = {
          title: "Default Name",
          time: timeStamp,
          place: "Unknown",
          items: goods,
          accumTotal: "$" + accumTotal.toFixed(2).toString(),
          detectedTotal: "$" + detectedTotal.toFixed(2).toString(),
          image_url: parsedData.path,
          status: "Pending"
        };

        uploadedCallback(receiptRecord);
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }
});

export default photoTools;
